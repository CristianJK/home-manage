# Shared Finances — Plan de Implementación

## Objetivo

Crear tres funcionalidades para finanzas compartidas:
1. Componente visual de desglose de porcentajes
2. Página para asignar porcentajes por usuario
3. Página para registrar pagos realizados

---

## Fase 1 — Componente `SharedFinanceBreakdown`

Extraer la sección "Desglose Proporcional" (hardcodeada en `SharedFinancesPage`) a un componente reutilizable.

### Frontend
- [ ] Crear `frontend/src/components/SharedFinanceBreakdown.jsx`
  - Props: `users` (array de `{ name, initials, percentage, shouldPay, hasPaid, balance, color }`)
  - Muestra cada usuario con: iniciales, nombre, badge de porcentaje, debe aportar, ha pagado, crédito/deuda
  - Botón "Ajustar porcentajes" que navega a `/shared-finances/percentages`
- [ ] Reemplazar sección hardcodeada en `SharedFinancesPage` con `<SharedFinanceBreakdown>`

---

## Fase 2 — Backend: API de Porcentajes

### Migración
- [ ] Crear migración `create_shared_expense_percentages_table`
  - Columnas: `id`, `user_id` (FK), `percentage` (decimal 5,2), `month` (date), `created_at`, `updated_at`
  - Unique constraint: (`user_id`, `month`)

### Modelo
- [ ] Crear `app/Models/SharedExpensePercentage.php`
  - `#[Fillable(['user_id', 'percentage', 'month'])]`
  - Relación `user()` BelongsTo

### Controlador
- [ ] Crear `app/Http/Controllers/Api/SharedExpensePercentageController.php`
  - `index()` — devuelve porcentajes del mes actual (crea por defecto desde salarios si no existen)
  - `update()` — actualiza porcentajes en batch (recibe array de `[{user_id, percentage}]`)

### Rutas
- [ ] Agregar en `routes/api.php`:
  ```
  Route::prefix('shared-finances/percentages')->middleware('auth:sanctum')->group(function () {
      Route::get('/', [SharedExpensePercentageController::class, 'index']);
      Route::put('/', [SharedExpensePercentageController::class, 'update']);
  });
  ```

---

## Fase 3 — Página de Asignación de Porcentajes

### Frontend
- [ ] Crear `frontend/src/schemas/sharedPercentage.js` — Zod (user_id, percentage)
- [ ] Crear `frontend/src/pages/SharedPercentagePage.jsx`
  - Fetch GET `/shared-finances/percentages`
  - Input numérico por usuario para editar porcentaje
  - Validar que sumen 100%
  - Botón "Guardar" → PUT `/shared-finances/percentages`
- [ ] Agregar ruta en `App.jsx`: `/shared-finances/percentages`

---

## Fase 4 — Backend: API de Pagos

### Migración
- [ ] Crear migración `create_shared_expense_payments_table`
  - Columnas: `id`, `user_id` (FK), `shared_expense_id` (FK, nullable), `amount` (decimal 15,2), `paid_at` (date), `notes` (text, nullable), `created_at`, `updated_at`

### Modelo
- [ ] Crear `app/Models/SharedExpensePayment.php`
  - `#[Fillable(['user_id', 'shared_expense_id', 'amount', 'paid_at', 'notes'])]`
  - Relaciones: `user()`, `sharedExpense()`

### Controlador
- [ ] Crear `app/Http/Controllers/Api/SharedExpensePaymentController.php`
  - CRUD completo: index, store, show, update, destroy
  - `index()` filtra por mes si se provee `?month=YYYY-MM`

### Rutas
- [ ] Agregar en `routes/api.php`:
  ```
  Route::prefix('shared-finances/payments')->middleware('auth:sanctum')->group(function () {
      Route::get('/', [SharedExpensePaymentController::class, 'index']);
      Route::post('/', [SharedExpensePaymentController::class, 'store']);
      Route::get('/{id}', [SharedExpensePaymentController::class, 'show']);
      Route::patch('/{id}', [SharedExpensePaymentController::class, 'update']);
      Route::delete('/{id}', [SharedExpensePaymentController::class, 'destroy']);
  });
  ```

---

## Fase 5 — Página de Pagos Realizados

### Frontend
- [ ] Crear `frontend/src/schemas/sharedPayment.js` — Zod (user_id, amount, paid_at, notes)
- [ ] Crear `frontend/src/components/SharedPaymentModal.jsx` — modal create/edit
- [ ] Crear `frontend/src/components/SharedPaymentTable.jsx` — tabla con edit/delete
- [ ] Crear `frontend/src/pages/SharedPaymentsPage.jsx` — página completa en `/shared-finances/payments`
- [ ] Agregar ruta en `App.jsx`: `/shared-finances/payments`

---

## Fase 6 — Integración

- [ ] Conectar `SharedFinanceSummary` con datos reales desde API
- [ ] Conectar `SharedFinanceBreakdown` con datos reales desde API de porcentajes + pagos
- [ ] Mostrar loading/error states en todas las páginas

---

## Resumen de Archivos a Crear/Modificar

| Archivo | Tipo |
|---------|------|
| `backend/database/migrations/..._create_shared_expense_percentages_table.php` | Crear |
| `backend/database/migrations/..._create_shared_expense_payments_table.php` | Crear |
| `backend/app/Models/SharedExpensePercentage.php` | Crear |
| `backend/app/Models/SharedExpensePayment.php` | Crear |
| `backend/app/Http/Controllers/Api/SharedExpensePercentageController.php` | Crear |
| `backend/app/Http/Controllers/Api/SharedExpensePaymentController.php` | Crear |
| `backend/routes/api.php` | Modificar |
| `frontend/src/schemas/sharedPercentage.js` | Crear |
| `frontend/src/schemas/sharedPayment.js` | Crear |
| `frontend/src/components/SharedFinanceBreakdown.jsx` | Crear |
| `frontend/src/components/SharedPaymentModal.jsx` | Crear |
| `frontend/src/components/SharedPaymentTable.jsx` | Crear |
| `frontend/src/pages/SharedPercentagePage.jsx` | Crear |
| `frontend/src/pages/SharedPaymentsPage.jsx` | Crear |
| `frontend/src/pages/SharedFinancesPage.jsx` | Modificar |
| `frontend/src/App.jsx` | Modificar |
