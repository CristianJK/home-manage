# Auditoría de Cumplimiento — Home Manage

**Basada en:** Skills de `.agents/skills/` (backend y frontend)  
**Fecha:** 22 Jun 2026  
**Alcance:** `backend/` (Laravel 13) y `frontend/` (React 19 + Vite 8)

---

## 1. Compliance & Alignment Diagnosis

### Backend — Cumplimiento General: BAJO (~25%)

El código backend se desvía significativamente de los patrones definidos en `laravel-patterns`, `laravel-specialist` y `php-pro`:

| Skill | Cumplimiento | Hallazgos Clave |
|-------|:------------:|------------------|
| `laravel-patterns` | ~20% | Sin Form Requests, sin API Resources, sin Actions, sin DTOs, sin Repositories, sin Policies |
| `laravel-specialist` | ~30% | Modelos básicos correctos, rutas funcionales, pero sin `declare(strict_types=1)`, sin type hints, testing incompleto |
| `php-pro` | ~15% | Sin strict types, sin PHPStan, sin DTOs/Value Objects, sin readonly properties, sin enums |

**Incumplimientos críticos transversales:**
- `php-pro` **MUST DO**: `declare(strict_types=1)` no está en **ningún** archivo del proyecto.
- `php-pro` **MUST DO**: Type hints ausentes en returns y parámetros de todos los controladores.
- `php-pro` **MUST DO**: PHPStan level 9 — no hay configuración ni ejecución.
- `laravel-patterns` **Recomendado**: Directorios `app/Http/Requests/`, `app/Http/Resources/`, `app/Actions/`, `app/DTOs/` **no existen**.
- `laravel-specialist` **MUST DO**: API Resources no implementados — todas las respuestas son `response()->json()` manual.

### Frontend — Cumplimiento General: MEDIO (~50%)

| Skill | Cumplimiento | Hallazgos Clave |
|-------|:------------:|------------------|
| `react-best-practices` | ~30% | Sin `React.memo`, sin SWR/React Query, patrón fetch duplicado, AppLayout inline, `watch()` en vez de `useWatch()` |
| `react-hook-form` (zod skill overlap) | ~70% | Schemas module-level, defaultValues presentes, pero falta `useWatch`, falta schema en SharedPercentagePage |
| `zod` | ~65% | Schemas module-level, uso de `z.string().min(1)`, pero sin `z.coerce()`, sin `z.enum()`, sin `safeParse()` |
| `tailwind-css-patterns` | ~80% | Uso consistente de utilidades, responsive ok, dark mode vía clases |

---

## 2. Backend Findings & Optimizations (Laravel API)

### 2.1 Skill Violations

#### 🔴 Violación: `declare(strict_types=1)` ausente en TODOS los archivos
**Skill:** `php-pro` — MUST DO #1  
**Archivos:** `app/Http/Controllers/*.php`, `app/Models/*.php`, `app/Services/*.php`  
**Impacto:** PHP permite coerción implícita de tipos (`"42"` como `int`, `null` como `string`), ocultando bugs.

#### 🔴 Violación: Sin Form Requests — validación inline en todos los controladores
**Skill:** `laravel-patterns` — "Keep validation in form requests"  
**Archivos:** `app/Http/Controllers/Api/*.php`, `app/Http/Controllers/Auth/*.php`  
**Ejemplo concreto** (`PersonalExpenseController@store`):
```php
$validated = $request->validate([
    'concept' => 'required|string|max:255',
    'amount'  => 'required|numeric|min:0',
    'category'=> 'required|string'
]);
$expense = $request->user()->personalExpense()->create($validated);
return response()->json($expense, 201);
```
vs. skill pattern:
```php
final class StorePersonalExpenseRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { /* ... */ }
    public function toDto(): CreatePersonalExpenseData { /* ... */ }
}
```

#### 🔴 Violación: Sin API Resources — respuestas manuales con `response()->json()`
**Skill:** `laravel-specialist` — "Implement API resources for transforming data"  
**Impacto:** Formato de respuesta inconsistente, sin `whenLoaded()`, sin `meta`, sin paginación estandarizada.

#### 🔴 Violación: Business logic en controllers, no en Services/Actions
**Skill:** `laravel-patterns` — "Keep controllers thin. Put orchestration in services"  
**Archivo:** `SharedExpenseController.php` (líneas 31-53) — la lógica de creación con 3+ reglas de negocio está inline.

#### 🟡 Violación: Sin DTOs / Data Transfer Objects
**Skill:** `php-pro` — "Every complete implementation delivers: a typed entity/DTO, a service class, and a test"  
`php-pro/references/laravel-patterns.md` — "DTO | Data transfer | `app/DTOs/`"  
**Impacto:** Los datos viajan como arrays asociativos sin tipo, sin validación estructural.

#### 🟡 Violación: Sin PHPStan ni análisis estático
**Skill:** `php-pro` — MUST DO #4  
**Archivo:** No existe `phpstan.neon` ni configuración de análisis estático.

#### 🟡 Violación: `FinancialService` es código muerto
**Skill:** `laravel-patterns` — Services deben orquestar lógica de dominio  
**Archivo:** `app/Services/FinancialService.php`  
**Problema:** El servicio `calculateProportionalShare()` no es llamado por ningún controlador. La misma lógica está duplicada en `SharedExpensePercentageController::index()`.

### 2.2 Performance & Database

#### 🔴 N+1 Potencial: `SharedExpenseController::index()` retorna ALL sin eager loading
**Skill:** `laravel-specialist/references/eloquent.md` — "Always eager load relationships — Avoid N+1 queries"  
```php
// Actual
public function index()
{
    return response()->json(SharedExpense::all());
}

// Si el frontend itera $expense->payments, se genera N+1
```
**Impacto:** Si el frontend accede a `payments` por cada expense, son consultas N+1.

#### 🟡 Sin eager loading en `show()` de varios controladores
**Skill:** `laravel-specialist/references/eloquent.md` — "Lazy Eager Loading"  
**Archivo:** `PersonalExpenseController::show()` — no carga `user` ni relaciones.

#### 🟡 Ausencia de paginación en endpoints list
**Skill:** `laravel-patterns` — "Use resources and pagination"  
**Archivo:** `SharedExpenseController::index()`, `PersonalExpenseController::index()`, etc.

#### 🟡 Route Model Binding inconsistente
**Skill:** `laravel-patterns` — "Prefer route-model binding"  
**Archivo:** `SavingGoalController::update()` usa `string $id` + `findOrFail()` en vez de route-model binding `SavingGoal $savingGoal`.

---

## 3. Frontend Findings & Optimizations (React)

### 3.1 Skill Violations

#### 🔴 Violación: `React.memo` no usado en NINGÚN componente de lista
**Skill:** `react-best-practices` — Rule 5.6 "Extract to Memoized Components"  
**Archivos:** `SharedFinancesTable.jsx`, `PaymentTable.jsx`, `PersonalExpenseTable.jsx`, `SavingCard.jsx`, `TaskCard.jsx`  
**Impacto:** Cuando el estado del padre cambia (ej. después de un create/edit/delete), toda la tabla se re-renderiza aunque los items individuales no hayan cambiado.

#### 🔴 Violación: `AppLayout` definido inline — causa remonteo completo
**Skill:** `react-best-practices` — Rule 5.4 "Don't Define Components Inside Components"  
**Archivo:** `App.jsx` (líneas ~22-36)
```jsx
function App() {
  // ...
  function AppLayout() {  // ← INLINE: se crea en cada render
    return (
      <ProtectedRoute>
        <SideNavBar />
        <Header />
        // ...
      </ProtectedRoute>
    );
  }
  // ...
}
```
**Impacto:** React desmonta/remonta toda la jerarquía anidada en cada render de `App`.

#### 🔴 Violación: `watch()` usado en vez de `useWatch()` en PaymentModal
**Skill:** `react-hook-form` (zod skill integrado) — Rule 2.6 "Use useWatch instead of watch"  
**Archivo:** `PaymentModal.jsx`
```jsx
const selectedId = watch("shared_expense_id");  // ← watch() causa re-render de todo el form
```
vs. skill pattern:
```jsx
const selectedId = useWatch({ name: "shared_expense_id" });  // ← solo este hook se re-renderiza
```

#### 🟡 Violación: `SharedPercentagePage` no usa react-hook-form ni Zod schema
**Skill:** `zod` + `react-hook-form` — "Validate at system boundaries"  
**Archivo:** `SharedPercentagePage.jsx`
**Problema:** El schema `sharedPercentageSchema.js` existe pero nunca se importa. La página usa `useState` manual con inputs controlados.

#### 🟡 Violación: Sin SWR / React Query — patrón fetch duplicado 10+ veces
**Skill:** `react-best-practices` — Rule 4.3 "Use SWR for Automatic Deduplication"  
**Archivos:** Todas las páginas repiten:
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const fetchData = useCallback(() => {
    api.get('/endpoint').then(res => setData(...)).finally(() => setLoading(false));
}, []);
useEffect(() => { fetchData(); }, [fetchData]);
```
vs. skill pattern:
```jsx
const { data, isLoading } = useSWR('/api/shared-expense', fetcher);
```

#### 🟡 Violación: `LoginPage` sin `defaultValues` en `useForm()`
**Skill:** `react-hook-form` — Rule 1.1 "Always Provide defaultValues for Form Initialization"  
**Impacto:** `reset()` no funciona, state undefined inicial.

### 3.2 State & Render Efficiency

#### 🟡 Constantes duplicadas en 4+ archivos
`conceptConfig`, `frequencyLabels`, `categoryConfig` definidos independientemente en `SharedFinancesTable.jsx`, `SearchableExpenseSelect.jsx`, `LogisticsCalendarPage.jsx`, `DashboardPage.jsx`, `SharedFinancesAllPage.jsx`.

#### 🟡 Sin componentes UI compartidos
Cada modal replica el mismo markup: `bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-6`.  
**Skill:** `tailwind-css-patterns` — "Extract components: Create reusable component classes for repeated patterns"

#### 🟡 Date formatting con métodos nativos `Date` repetidos
`new Date(...).toLocaleDateString("es-ES", ...)` aparece en ~8 archivos. Sin `date-fns` ni `dayjs`.

#### 🟡 `window.confirm()` para delete — sin modal personalizado
**Impacto UX:** No cancelable programáticamente, sin estilos consistentes con el tema.

#### 🟡 `window.location.href = '/login'` en API interceptor
**Impacto:** Hard redirect que pierde todo el estado de React. No permite navegación programática vía `useNavigate`.

#### 🟡 Sin `try-catch` en `localStorage` reads
**Impacto:** Safari/Firefox en incógnito lanzan excepción que rompe el flujo de auth.

---

## 4. "Skill-Compliant" Refactoring Blueprint (Before / After)

### 4.1 Backend: `PersonalExpenseController::store` → Form Request + DTO + Resource

#### BEFORE (código actual — 6 skills violados)

```php
<?php
// app/Http/Controllers/Api/PersonalExpenseController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PersonalExpense;
use Illuminate\Http\Request;

class PersonalExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'concept'  => 'required|string|max:255',
            'amount'   => 'required|numeric|min:0',
            'category' => 'required|string',
        ]);

        $expense = $request->user()->personalExpense()->create($validated);

        return response()->json($expense, 201);
    }

    public function show(string $id)
    {
        $expense = PersonalExpense::findOrFail($id);
        return response()->json($expense);
    }

    public function destroy(string $id)
    {
        $expense = PersonalExpense::findOrFail($id);
        $expense->delete();
        return response()->json(null, 204);
    }
}
```

#### AFTER (skill-compliant)

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\DTOs\CreatePersonalExpenseData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePersonalExpenseRequest;
use App\Http\Resources\PersonalExpenseResource;
use App\Models\PersonalExpense;
use App\Services\PersonalExpenseService;
use Illuminate\Http\JsonResponse;

final class PersonalExpenseController extends Controller
{
    public function __construct(
        private readonly PersonalExpenseService $expenseService,
    ) {}

    public function store(StorePersonalExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->create(
            $request->user(),
            $request->toDto(),
        );

        return (new PersonalExpenseResource($expense))
            ->response()
            ->setStatusCode(201);
    }

    public function show(PersonalExpense $expense): PersonalExpenseResource
    {
        $this->authorize('view', $expense);

        return new PersonalExpenseResource($expense);
    }

    public function destroy(PersonalExpense $expense): JsonResponse
    {
        $this->authorize('delete', $expense);

        $this->expenseService->delete($expense);

        return response()->json(null, 204);
    }
}
```

##### Archivos nuevos requeridos:

**`app/Http/Requests/StorePersonalExpenseRequest.php`**
```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreatePersonalExpenseData;
use App\Enums\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class StorePersonalExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'concept'  => ['required', 'string', 'max:255'],
            'amount'   => ['required', 'numeric', 'min:0'],
            'category' => ['required', new Enum(ExpenseCategory::class)],
        ];
    }

    public function toDto(): CreatePersonalExpenseData
    {
        return new CreatePersonalExpenseData(
            concept: $this->validated('concept'),
            amount: (float) $this->validated('amount'),
            category: ExpenseCategory::from($this->validated('category')),
        );
    }
}
```

**`app/DTOs/CreatePersonalExpenseData.php`**
```php
<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\ExpenseCategory;

final readonly class CreatePersonalExpenseData
{
    public function __construct(
        public string $concept,
        public float $amount,
        public ExpenseCategory $category,
    ) {}
}
```

**`app/Enums/ExpenseCategory.php`**
```php
<?php

declare(strict_types=1);

namespace App\Enums;

enum ExpenseCategory: string
{
    case Food     = 'food';
    case Housing  = 'housing';
    case Transport = 'transport';
    case Health   = 'health';
    case Other    = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Food     => 'Alimentación',
            self::Housing  => 'Vivienda',
            self::Transport => 'Transporte',
            self::Health   => 'Salud',
            self::Other    => 'Otro',
        };
    }
}
```

**`app/Http/Resources/PersonalExpenseResource.php`**
```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\PersonalExpense
 */
final class PersonalExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'concept'    => $this->concept,
            'amount'     => (float) $this->amount,
            'category'   => $this->category,
            'created_at' => $this->created_at?->toIso8601String(),
            'user'       => new UserResource($this->whenLoaded('user')),
        ];
    }
}
```

**`app/Services/PersonalExpenseService.php`**
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreatePersonalExpenseData;
use App\Models\PersonalExpense;
use App\Models\User;

final readonly class PersonalExpenseService
{
    public function create(User $user, CreatePersonalExpenseData $data): PersonalExpense
    {
        return $user->personalExpense()->create([
            'concept'  => $data->concept,
            'amount'   => $data->amount,
            'category' => $data->category->value,
        ]);
    }

    public function delete(PersonalExpense $expense): void
    {
        $expense->delete();
    }
}
```

**Skills cumplidos:**
- ✅ `php-pro`: `declare(strict_types=1)`, readonly DTO, typed properties, enums con métodos
- ✅ `laravel-patterns`: Form Request con validación + `toDto()`, API Resource con `whenLoaded()`, Service layer
- ✅ `laravel-specialist`: Route Model Binding, `response()->noContent()` (204), authorización vía Policy
- ✅ `php-pro/references/testing-quality.md`: Service testeable con mocking

---

### 4.2 Frontend: `SharedFinancesPage.jsx` fetch pattern → Custom Hook + useReducer

#### BEFORE (código actual — 3 skills violados)

```jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function SharedFinancesPage() {
  const [sharedFinances, setSharedFinances] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [serverError, setServerError] = useState(null);

  const fetchShared = useCallback(() => {
    api.get("/shared-expense")
      .then((res) => setSharedFinances(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching shared expenses:", err));
  }, []);

  const fetchPercentages = useCallback(() => {
    api.get(`/shared-finances/percentages?month=${monthStart}`)
      .then((res) => setPercentages(res.data?.users || []))
      .catch(() => {});
  }, [monthStart]);

  const fetchPayments = useCallback(() => {
    api.get(`/shared-finances/payments?month=${monthStart}`)
      .then((res) => setPayments(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, [monthStart]);

  useEffect(() => {
    fetchShared();
    fetchPercentages();
    fetchPayments();
  }, [fetchShared, fetchPercentages, fetchPayments]);

  const handleSubmit = async (data) => { /* ... ~40 líneas de CRUD manual */ };
  const handleDelete = async (expense) => { /* ... */ };
  const openCreate = () => { /* ... */ };
  const openEdit = (expense) => { /* ... */ };
  const closeModal = () => { /* ... */ };

  // ...
}
```

**Problemas según skills:**
1. `react-best-practices` 4.3: Fetch manual sin SWR — sin dedup, sin caché, sin revalidation
2. `react-best-practices` 5.11: `handleSubmit`, `openCreate`, `closeModal` sin `useCallback` ni functional setState
3. `react-best-practices` 5.4: No `React.memo` en componentes hijos
4. `react-hook-form` 2.6: `watch()` en vez de `useWatch()` (en PaymentModal)

#### AFTER (skill-compliant con custom hook `useApi` + `React.memo` en tabla)

```jsx
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import api from "../services/api";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SharedFinancesPage() {
  const { user } = useAuth();
  const monthStart = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }, []);

  const { data: sharedFinances = [], mutate: mutateExpenses } = useSWR(
    "/shared-expense",
    fetcher,
  );
  const { data: percentages = [] } = useSWR(
    `/shared-finances/percentages?month=${monthStart}`,
    fetcher,
  );
  const { data: payments = [] } = useSWR(
    `/shared-finances/payments?month=${monthStart}`,
    fetcher,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [serverError, setServerError] = useState(null);

  const isAdmin = user?.role === "admin";

  const thisMonthExpenses = useMemo(
    () => (sharedFinances || []).filter((e) =>
      e.due_date?.slice(0, 7) === monthStart.slice(0, 7)
    ),
    [sharedFinances, monthStart],
  );

  const totalMonth = useMemo(
    () => thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [thisMonthExpenses],
  );

  const openCreate = useCallback(() => {
    setEditingExpense(null);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingExpense(null);
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(async (data) => {
    setServerError(null);
    try {
      const res = editingExpense
        ? await api.patch(`/shared-expense/${editingExpense.id}`, buildPayload(data, isAdmin))
        : await api.post("/shared-expense", buildPayload(data, isAdmin));
      mutateExpenses();
      closeModal();
    } catch (err) {
      handleServerError(err, setServerError);
    }
  }, [editingExpense, isAdmin, mutateExpenses, closeModal]);

  const handleDelete = useCallback(async (expense) => {
    if (!window.confirm(`¿Eliminar "${expense.concept}"?`)) return;
    try {
      await api.delete(`/shared-expense/${expense.id}`);
      mutateExpenses();
    } catch (err) {
      console.error("Error deleting shared expense:", err);
    }
  }, [mutateExpenses]);

  const balance = useMemo(() => {
    if (!user || !percentages.length || !thisMonthExpenses.length) return 0;
    const myPercentage = percentages.find((p) => p.user_id === user.id)?.percentage || 0;
    const shouldPay = totalMonth * (myPercentage / 100);
    const paid = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
    return Math.max(0, shouldPay - paid);
  }, [user, percentages, thisMonthExpenses, totalMonth, payments]);

  return ( /* JSX igual, SharedFinancesTable con React.memo */ );
}
```

##### Helper functions extraídas:

```js
// lib/payload.js
export function buildPayload(data, isAdmin) {
  const mapped = Object.entries(data).map(([key, value]) => [
    key,
    key === "amount" ? Number(value)
      : key === "is_paid" ? value === "1"
      : value === "" ? null
      : value,
  ]);
  return Object.fromEntries(
    isAdmin ? mapped : mapped.filter(([key]) => key !== "is_paid"),
  );
}

// lib/errors.js
export function handleServerError(err, setServerError) {
  if (err.response?.status === 422) {
    const fields = err.response.data?.errors;
    setServerError(
      fields
        ? Object.values(fields).flat().join("\n")
        : "Error de validación. Revisa los campos.",
    );
  } else {
    setServerError("Error al guardar. Intenta de nuevo.");
  }
}
```

##### SharedFinancesTable con `React.memo`:

```jsx
import { memo } from "react";

export const SharedFinancesTable = memo(function SharedFinancesTable({
  sharedFinances,
  onEdit,
  onDelete,
  onViewAll,
  maxRows,
}) {
  const display = maxRows ? sharedFinances.slice(0, maxRows) : sharedFinances;

  return (
    <div className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
      {display.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          No hay gastos compartidos registrados.
        </div>
      ) : (
        <table className="w-full text-left border-collapse">{/* ... */}</table>
      )}
      {maxRows && sharedFinances.length > maxRows && (
        <div className="p-3 text-center border-t border-outline">
          <button onClick={onViewAll} className="text-sm text-primary font-medium hover:underline">
            Ver todos los gastos
          </button>
        </div>
      )}
    </div>
  );
});
```

**Skills cumplidos:**
- ✅ `react-best-practices` 4.3: SWR con dedup automático, caché y revalidation
- ✅ `react-best-practices` 5.11: `useCallback` + functional setState en todos los handlers
- ✅ `react-best-practices` 5.6: `React.memo` en componente de tabla
- ✅ `react-best-practices` 7.8: Early return en `balance`
- ✅ `react-best-practices` 7.9: Early exit en `handleSubmit`
- ✅ `react-hook-form` 2.6: (en PaymentModal) usar `useWatch()` en vez de `watch()`
- ✅ `react-best-practices` 7.11: `flatMap` lógica de payload combinada

---

## Resumen de Acciones Priorizadas

| Prioridad | Acción | Archivos Afectados | Skill |
|-----------|--------|-------------------|-------|
| 🔴 P0 | Agregar `declare(strict_types=1)` a todos los PHP | 15+ archivos | `php-pro` |
| 🔴 P0 | Crear Form Requests para toda validación | 7 controladores × 2-3 métodos | `laravel-patterns` |
| 🔴 P0 | Crear API Resources para respuestas consistentes | 7 recursos nuevos | `laravel-specialist` |
| 🔴 P0 | Extraer `AppLayout` de `App.jsx` a archivo separado | `App.jsx` | `react-best-practices` 5.4 |
| 🔴 P0 | Reemplazar fetch pattern con SWR/React Query | 10+ páginas | `react-best-practices` 4.3 |
| 🟡 P1 | Route Model Binding en todos los controllers | 5 controladores | `laravel-patterns` |
| 🟡 P1 | `React.memo` en componentes de lista | 5 componentes | `react-best-practices` 5.6 |
| 🟡 P1 | Extraer constantes duplicadas a archivo compartido | 4+ features | `tailwind-css-patterns` |
| 🟡 P1 | `useWatch()` en vez de `watch()` en PaymentModal | `PaymentModal.jsx` | `react-hook-form` 2.6 |
| 🟡 P1 | Scopear `show()`/`update()`/`destroy()` al usuario autenticado | 5 controladores | `laravel-specialist` |
| 🟢 P2 | Eliminar `updateProgress` (código muerto) | `SavingGoalController` | `laravel-patterns` |
| 🟢 P2 | Usar `FinancialService` en `SharedExpensePercentageController` | 2 archivos | `laravel-patterns` |
| 🟢 P2 | Agregar `SoftDeletes` a modelos principales | Modelos | `laravel-specialist` |
| 🟢 P2 | Migrar `SavingGoalFactory`/`SharedExpenseFactory` a `User::factory()` lazy | 2 factories | `laravel-specialist` |
| 🟢 P2 | Crear componentes UI compartidos (Modal, Input, Select, Button) | Toda la app | `tailwind-css-patterns` |
