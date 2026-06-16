---
id: 2606061326-Home_Manage
tags:
  - checklist
  - projects
---
# Home_Manage

##  Descripción
Este documento sirve como hoja de ruta y lista de verificación (checklist) para el desarrollo de la aplicación de gestión de tareas y finanzas compartidas.

>[!abstract] Resumen
> **HomeManage** es una aplicación diseñada para centralizar la logística y economía de un hogar. Permite la asignación de tareas domésticas, el seguimiento de gastos comunes divididos proporcionalmente según el salario de los integrantes, la gestión de ahorros personales y la planeación de gastos recurrentes (mensuales, semestrales, anuales).
> 

### Tecnologías Core:
- **Backend:** Laravel 13 (API REST)
- **Frontend:** React + Tailwind CSS (Preparado para Android vía PWA/Capacitor)
- **Base de Datos:** PostgreSQL
- **Autenticación:** Google OAuth 2.0 (Laravel Socialite) y Local Email - Password
- 
---
## Check List

## 1 Definición de proyecto



### 2.  Alistamiento Local

- [x] Docker  y Composer.
- [x] Instalar Node.js y NPM/Yarn.
- [x] Configurar PostgreSQL y crear la base de datos `home_manage`.
- [x] Crear proyecto Laravel: .
- [ ] Crear proyecto React: `npx create-react-app frontend` (o usando Vite).
- [x] Configurar variables de entorno (`.env`) para DB y Google Client ID/Secret.

---

## 3 . Fase 1: Arquitectura de Datos (Backend)

- [x] **Modelos y Migraciones:**
    - [x] `User`: Agregar `salary`, `google_id`, `avatar`.
    - [x] `Task`: `title`, `description`, `assigned_to`, `status`, `due_date`.
    - [x] `SharedExpense`: `concept`, `amount`, `frequency`, `due_date`, `is_paid`.
    - [x] `PersonalExpense`: `user_id`, `concept`, `amount`, `category`.
    - [x] `SavingGoal`: `user_id`, `target_amount`, `current_amount`, `deadline`.
- [ ] **Relaciones Eloquent:** Definir pertenencia de tareas y gastos a usuarios.

---

## 4. Fase 2: Autenticación y Seguridad

- [x] Instalar Laravel Socialite.
- [ ] Implementar el Callback de Google en el Backend.
- [ ] Configurar Laravel Sanctum para la emisión de tokens hacia React.
- [ ] Middleware para proteger rutas financieras.

---

## 5. Fase 3: Lógica de Negocio (El Motor)

- [ ] **Cálculo Proporcional:**
    - [ ] Crear un `FinancialService` para sumar salarios totales.
    - [ ] Calcular porcentaje por usuario: `(Salario Individual / Salario Total) * 100`.
- [ ] **Gestión de Gastos:**
    - [ ] CRUD de gastos compartidos.
    - [ ] Implementar lógica de periodicidad (mensual, semestral, anual).
- [ ] **Gestión de Tareas:**
    - [ ] CRUD de tareas con asignación dinámica.
    - [ ] Filtros por estado (Pendiente/Hecho).

---

## 6. Fase 4: Interfaz de Usuario (Frontend)

- [ ] **Layout Base:** Sidebar, navegación y perfil de usuario.
- [ ] **Dashboard Principal:** Resumen de "Qué debo hoy" (tareas y deudas).
- [ ] **Módulo Financiero:**
    - [ ] Tabla de gastos comunes con el monto calculado por pagar.
    - [ ] Sección de gastos personales.
    - [ ] Gráfico de progreso de ahorros.
- [ ] **Cierre Anual:** Botón de "Finalizar Año" que ejecute el balance y guarde históricos.

---

## 7. Fase 5: Cierre de Ciclo y Mantenimiento

- [ ] Crear comando Artisan `app:annual-closure` para archivar datos.
- [ ] Implementar ajuste de valores de gastos fijos para el nuevo año.
- [ ] Pruebas unitarias para el cálculo de porcentajes.

---

## Implementación / Código

```query


