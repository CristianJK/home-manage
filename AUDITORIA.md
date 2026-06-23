# Auditoría de Arquitectura, Rendimiento y Buenas Prácticas

**Proyecto:** HomeManage (Laravel 13 + React 19)
**Fecha:** 22 Junio 2026
**Auditor:** Ingeniero de Software Principal

---

## 1. Evaluación Arquitectónica General

### Interacción API ↔ Frontend

El decoupling es **funcional pero básico**. El frontend consume la API REST de Laravel a través de axios con un interceptor centralizado (`services/api.js`) que inyecta el token `Bearer` y redirige al login en 401. Cada página gestiona su propio fetching de datos con `useEffect` + `useCallback`, sin capa de caching, estado global (más allá de `AuthContext`), ni librería de server state (React Query, SWR, RTK Query).

**Fortalezas:**
- Separación limpia de responsabilidades: backend monolítico API-first, frontend SPA sin SSR.
- Las rutas de API siguen una convención RESTful predecible (`/api/resource`, `/api/resource/{id}`).
- Sanctum token auth con expiración silenciosa manejada por interceptor.
- El frontend usa `lazy()` + `Suspense` para code splitting por página (buena práctica).

**Debilidades:**
- **Sin capa de servicios compartidos:** Cada página repite el patrón `fetch → loading state → error state → data state`. No existe abstracción como `useApi` hook o `QueryClient`.
- **Sin API Resources en backend:** Todas las respuestas se construyen manualmente con `response()->json([...])` y `map()`. No hay transformación consistente de datos.
- **Sin Form Requests:** La validación está inline en los controladores, mezclando lógica de negocio con HTTP.
- **Duplicación masiva de lógica:** El mismo patrón de manejo de errores 422 se repite en 10+ páginas del frontend.

> **Veredicto:** Arquitectura correcta para un MVP funcional, pero con deuda técnica acumulada que impacta escalabilidad y mantenibilidad. Prioridad media-alta de refactorización.

---

## 2. Hallazgos en el Backend (Laravel)

### 🔴 Bloqueantes / Rendimiento

#### 2.1. N+1 en `TaskController::show()` y `update()`

```php
// backend/app/Http/Controllers/Api/TaskController.php
public function show(string $id)
{
    $task = Task::findOrFail($id);       // ← Sin ->with('user')
    return response()->json($task);       // ← Si el frontend accede a $task->user, query extra
}
```

**Impacto:** Si el frontend renderiza `task.user.name` (como hace `LogisticsCalendarPage.jsx`), se dispara una query adicional por cada tarea. En el index ya se resuelve con `->with('user')`, pero en `show` no.

#### 2.2. `SharedExpenseController::index()` — Sin eager loading

```php
public function index()
{
    return response()->json(SharedExpense::all());  // ← Sin ->with('payments')
}
```

**Impacto:** La página de Shared Finances filtra gastos del mes y calcula totales. Si en el futuro se agrega acceso a `$expense->payments` en el listado, será N+1. El endpoint `withPayments()` existe separado, pero `index()` no lo carga.

#### 2.3. `PersonalExpenseController::show()` — Sin scope de usuario

```php
public function show(string $id)
{
    $expense = PersonalExpense::findOrFail($id);  // ← Cualquier usuario ve cualquier gasto
    return response()->json($expense);
}
```

**Riesgo de seguridad:** Muestra datos de gastos de otros usuarios sin verificar autenticación o propiedad. El `index()` sí escopa por `$request->user()`.

#### 2.4. `SharedExpensePaymentController::show()` — Sin scope de usuario

```php
public function show(string $id)
{
    $payment = SharedExpensePayment::with(['user', 'sharedExpense'])->findOrFail($id);
    return response()->json($payment);
}
```

**Riesgo de seguridad:** Cualquier usuario autenticado puede ver pagos ajenos. Debería tener `->where('user_id', auth()->id())`.

---

### 🟡 Refactorización Sugerida

#### 2.5. `SharedExpensePercentageController::index()` — Mezcla responsabilidades

```php
public function index(Request $request)
{
    // 1. Parseo de input
    $month = ...
    // 2. Query a DB
    $percentages = SharedExpensePercentage::with('user')->where('month', $month)->get();
    // 3. Lógica de negocio: cálculo de salarios y creación de registros por defecto
    if ($percentages->isEmpty()) {
        $users = User::where('salary', '>', 0)->get();
        $totalSalary = $users->sum('salary');
        // ...creación de registros y mapeo manual...
    }
    // 4. Respuesta formateada manualmente
    return response()->json(['month' => $month, 'users' => $defaults]);
}
```

**Problema:** Este controlador hace 4 cosas distintas. La lógica de "crear porcentajes por defecto basados en salarios" debería estar en un **Service** o **Action**. La respuesta debería usar un **API Resource**.

#### 2.6. `AuthController::register()` — Mezcla registro con creación de token

```php
$user = User::create([...]);
$token = $user->createToken('auth_token')->plainTextToken;
return response()->json(['access_token' => $token, 'user' => $user], 201);
```

**Problema:** La creación del token debería estar en un servicio de autenticación. El controlador llama a `createToken` directamente, acoplando registro con generación de tokens.

#### 2.7. Inconsistencia en Route Model Binding

```php
// SavingGoalController
public function updateProgress(Request $request, SavingGoal $savingGoal)  // ← Route Model Binding
public function update(Request $request, string $id)                       // ← string $id
public function destroy(string $id)                                        // ← string $id
```

**Problema:** `updateProgress` usa inyección automática del modelo, mientras `update` y `destroy` hacen `findOrFail` manualmente. Inconsistente.

#### 2.8. `PersonalExpenseController::destroy()` — Retorna 204, los demás retornan 200

```php
// PersonalExpenseController
public function destroy(string $id)
{
    ...
    return response()->json(null, 204);     // ← null body

// TaskController, SharedExpenseController, SavingGoalController
public function destroy(string $id)
{
    ...
    return response()->json($task);         // ← 200 con el modelo eliminado
}
```

**Inconsistencia:** Algunos `destroy` devuelven el modelo eliminado (200), otros null (204). Debería estandarizarse. RESTful convention dicta 200 con el recurso o 204 sin body.

---

### 🟢 Clean Code & Buenas Prácticas

#### 2.9. Ausencia de Form Requests

Todos los controladores usan `$request->validate([...])` inline. Para un proyecto que ya escala a 7 controladores, se necesitan **Form Requests** dedicados. Esto:
- Separa la validación del controlador
- Permite reutilizar reglas
- Facilita la personalización de mensajes de error
- Permite autorización (`authorize()`)

#### 2.10. Ausencia de API Resources

Ninguna respuesta usa `JsonResource`. Las respuestas se construyen manualmente con `map()` y `response()->json([...])`. Esto:
- Duplica la transformación de datos
- No hay una fuente única de verdad para la forma de los recursos
- Dificulta incluir/ocultar campos condicionalmente

#### 2.11. `FinancialService::calculateProportionalShare()` — Sin uso real

```php
public function calculateProportionalShare(float $totalAmount): array
{
    $users = User::all(['id', 'name', 'salary']);
    ...
}
```

Este servicio existe pero **no es llamado por ningún controlador**. La lógica de reparto proporcional está duplicada en `SharedExpensePercentageController::index()`. Esto es código muerto o lógica duplicada.

#### 2.12. `AppServiceProvider::boot()` — Vacío

El `AppServiceProvider` no registra nada. Para un proyecto de este tamaño, debería al menos configurar la longitud de strings por defecto (MySQL), eager loading global (para evitar N+1 olvidadizos), o macro para respuestas consistentes.

---

## 3. Hallazgos en el Frontend (React)

### 🔴 Optimización de Rendimiento

#### 3.1. Sin `React.memo` en componentes de lista

**Impacto:** Componentes como `SavingCard`, `TaskCard`, `PaymentTable`, `SharedFinancesTable` no están memoizados. Al actualizar el estado de la página (ej. al crear/editar un elemento), todos los items de la lista se re-renderizan, no solo el modificado.

#### 3.2. Arrow functions en `onClick` de listas

En `DashboardPage.jsx:150-170` y similares:
```jsx
{pendingTasks.slice(0, 5).map((task) => (
  <button onClick={() => handleCompleteTask(task)} ...>
```

Cada render del dashboard crea nuevas funciones para cada item de la lista, impidiendo la memoización incluso si se usara `React.memo`.

#### 3.3. `SharedFinanceBreakdown` — Datos hardcodeados

```jsx
<SharedFinanceBreakdown
  users={[
    { user_id: 1, name: "Usuario A", ... },  // ← Hardcoded
    { user_id: 2, name: "Usuario B", ... },  // ← Hardcoded
  ]}
```

**Impacto:** Esta sección del `SharedFinancesPage` muestra datos falsos. El componente recibe props estáticas, no datos del backend, lo que engaña al usuario.

---

### 🟡 Consumo de Datos & Estado

#### 3.4. Patrón de fetch duplicado en 10+ páginas

Cada página repite exactamente el mismo patrón:
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchFn = useCallback(() => {
  api.get("/endpoint")
    .then(res => setData(...))
    .catch(err => console.error(...))
    .finally(() => setLoading(false));
}, []);

useEffect(() => { fetchFn(); }, [fetchFn]);
```

Esto es código boilerplate que debería abstraerse en un hook personalizado `useApi` o migrar a React Query. La falta de esta abstracción causa:
- Duplicación de lógica de errores
- Sin refetch automático
- Sin caché
- Sin soporte para mutaciones optimistas

#### 3.5. Manejo de errores 422 manual y duplicado

```jsx
catch (err) {
  if (err.response?.status === 422) {
    const fields = err.response.data?.errors;
    if (fields) {
      setServerError(Object.values(fields).flat().join("\n"));
    } else {
      setServerError("Error de validación. Revisa los campos.");
    }
  } else {
    setServerError("Error al guardar el gasto. Intenta de nuevo.");
  }
}
```

Este bloque de ~15 líneas se repite **en cada submit de cada modal** (al menos 8 veces en el proyecto). Debería ser un helper o un interceptor.

#### 3.6. `PersonalExpensePage` — Carga doble

```jsx
// SavingsPage.jsx
useEffect(() => { fetchSavings(); fetchExpenses(); }, [fetchSavings, fetchExpenses]);

// PersonalExpensesPage.jsx (owned by /savings/expenses route)
useEffect(() => { fetchExpenses() }, [fetchExpenses]);
```

Si el usuario naveja de `/savings` a `/savings/expenses`, los gastos se vuelven a fetchear. Sin caché ni estado compartido, hay llamadas redundantes a la API.

---

### 🟢 Mantenibilidad

#### 3.7. Convenciones de nombres mixtas

- `sideNavBar.jsx` — camelCase inconsistente (debería ser `SideNavBar.jsx` o `Sidebar.jsx`)
- Archivos en `features/` mezclan PascalCase (`PaymentTable.jsx`), camelCase (`sharedExpenseSchema.js`), y lowercase (`taskSchema.js`)
- Funciones exportadas vs default: `export function PaymentTable` vs `export default function PaymentsPage`

**Recomendación:** Estandarizar: PascalCase para componentes, camelCase para utilidades/schemas, siempre named exports para componentes en features.

#### 3.8. Import de `React` innecesario

En React 17+ con JSX Transform, `import React from 'react'` no es necesario. Este proyecto importa `React` en algunos archivos pero no en otros. Inconsistente.

---

## 4. Ejemplos Concretos de Refactorización

### Ejemplo 1: Backend — Form Request + Service Layer (SharedExpenseController)

#### 🔴 Antes

```php
// backend/app/Http/Controllers/Api/SharedExpenseController.php
class SharedExpenseController extends Controller
{
    public function store(Request $request)
    {
        $rules = [
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
            'comment' => 'nullable|string|max:255',
        ];

        if ($request->user()->isAdmin()) {
            $rules['is_paid'] = 'boolean';
        }

        $validate = $request->validate($rules);
        $validate['user_id'] = $request->user()->id;

        if (!array_key_exists('is_paid', $validate)) {
            $validate['is_paid'] = false;
        }

        $sharedExpense = SharedExpense::create($validate);
        return response()->json($sharedExpense, 201);
    }

    public function update(Request $request, string $id)
    {
        $rules = [ /* duplicado */ ];
        // mismas validaciones copiadas
        $sharedExpense = SharedExpense::findOrFail($id);
        $sharedExpense->update($validate);
        return response()->json($sharedExpense);
    }
}
```

#### 🟢 Después

```php
// backend/app/Http/Requests/StoreSharedExpenseRequest.php
class StoreSharedExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'concept' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', Rule::in(['unique', 'monthly', 'yearly', 'biweekly', 'semiannual'])],
            'due_date' => ['required', 'date', 'after_or_equal:today'],
            'comment' => ['nullable', 'string', 'max:255'],
        ];

        if ($this->user()?->isAdmin()) {
            $rules['is_paid'] = 'boolean';
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['user_id' => $this->user()->id]);
    }
}

// backend/app/Http/Resources/SharedExpenseResource.php
class SharedExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'concept' => $this->concept,
            'amount' => (float) $this->amount,
            'frequency' => $this->frequency,
            'due_date' => $this->due_date,
            'is_paid' => (bool) $this->is_paid,
            'comment' => $this->comment,
            'payments' => SharedExpensePaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
        ];
    }
}

// backend/app/Http/Controllers/Api/SharedExpenseController.php
class SharedExpenseController extends Controller
{
    public function store(StoreSharedExpenseRequest $request): JsonResponse
    {
        $expense = SharedExpense::create($request->validated());
        return SharedExpenseResource::make($expense)->response()->setStatusCode(201);
    }

    public function update(UpdateSharedExpenseRequest $request, SharedExpense $sharedExpense): JsonResponse
    {
        $sharedExpense->update($request->validated());
        return SharedExpenseResource::make($sharedExpense);
    }
}
```

**Beneficios:**
- Validación desacoplada del controlador
- Reglas reutilizables entre store/update con `sometimes`
- Autorización manejada en el Form Request
- Respuestas consistentes con el Resource
- Route Model Binding eliminó el `findOrFail` manual

---

### Ejemplo 2: Frontend — Custom Hook `useApi` para eliminar boilerplate

#### 🔴 Antes

```jsx
// Repetido en cada página:
export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(() => {
    api.get("/shared-finances/payments")
      .then((res) => setPayments(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching payments:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleSubmit = async (data) => {
    // +15 líneas de manejo de errores 422
    try {
      const res = editingPayment
        ? await api.patch(`/shared-finances/payments/${editingPayment.id}`, payload)
        : await api.post("/shared-finances/payments", payload);
      // actualizar estado...
    } catch (err) {
      if (err.response?.status === 422) { /* manejo duplicado */ }
    }
  };
  // ... y así en cada página
}
```

#### 🟢 Después

```jsx
// frontend/src/hooks/useApi.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useApi(url, options = {}) {
  const [data, setData] = useState(options.initialData ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      setData(Array.isArray(res.data) ? res.data : res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, setData, loading, error, refetch: fetch };
}

// frontend/src/utils/handleApiError.js
export function handleApiError(err) {
  if (err.response?.status === 422) {
    const fields = err.response.data?.errors;
    return fields
      ? Object.values(fields).flat().join("\n")
      : "Error de validación. Revisa los campos.";
  }
  return err.response?.data?.message || "Error al guardar. Intenta de nuevo.";
}

// frontend/src/pages/PaymentsPage.jsx — Refactorizado
export default function PaymentsPage() {
  const navigate = useNavigate();
  const { data: payments, setData: setPayments, loading } = useApi("/shared-finances/payments");
  const { data: sharedExpenses } = useApi("/shared-expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (data) => {
    setServerError(null);
    const payload = { /* ... */ };
    try {
      const res = editingPayment
        ? await api.patch(`/shared-finances/payments/${editingPayment.id}`, payload)
        : await api.post("/shared-finances/payments", payload);
      setPayments(prev => editingPayment
        ? prev.map(p => p.id === editingPayment.id ? res.data : p)
        : [...prev, res.data]);
      closeModal();
    } catch (err) {
      setServerError(handleApiError(err));
    }
  };
  // ...
}
```

**Beneficios:**
- Elimina ~20 líneas de boilerplate por página
- Manejo de errores centralizado
- Carga/recarga consistente
- Fácil migración futura a React Query (misma firma)

---

## Resumen de Prioridades

| Prioridad | Hallazgo | Impacto | Esfuerzo |
|-----------|----------|---------|----------|
| 🔴 Crítico | `PersonalExpense::show()` y `SharedExpensePayment::show()` sin scope de usuario | **Seguridad** — datos expuestos | Bajo |
| 🔴 Crítico | `SharedFinanceBreakdown` con datos hardcodeados | **UX** — información incorrecta | Bajo |
| 🟡 Alto | Falta de Form Requests y API Resources | **Mantenibilidad** — validación y respuestas inconsistentes | Medio |
| 🟡 Alto | Patrón fetch duplicado sin abstracción | **Escalabilidad** — 10+ implementaciones iguales | Medio |
| 🟡 Alto | Sin `React.memo` ni key optimizadas en listas | **Rendimiento** — re-renders innecesarios | Bajo |
| 🟡 Medio | `FinancialService` no utilizado; lógica duplicada en controladores | **Deuda técnica** — código muerto | Bajo |
| 🟢 Bajo | Inconsistencia en destroy (204 vs 200) | **Consistencia** REST | Bajo |
| 🟢 Bajo | Convenciones de nombres mixtas | **Mantenibilidad** | Bajo |
