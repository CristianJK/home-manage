# Home Manage — Agent Guide

## Project structure

- `backend/` — Laravel 13 API (PHP 8.3+), Sanctum token auth, SQLite local / PostgreSQL Docker
- `frontend/` — React + Tailwind CSS (prepared for Android by PWA/Capacitor)
- `docker/` — nginx + PHP 8.3-fpm, `docker compose` exposes app on `:8001`
- `MarkDown/` — API endpoint docs (reference only; verify against code)

## Commands

### Backend (run from `backend/`)

| Command | What it does |
|---|---|
| `composer setup` | Full first-time setup (install, `.env`, key, migrate, npm build) |
| `composer dev` | Runs `php artisan serve` + queue:listen + pail(logs) + vite concurrently |
| `docker compose exec app composer test` | Runs tests inside Docker container |

### Frontend (run from `frontend/`)

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server (default `http://localhost:5173`) |
| `pnpm build` | Production build |
| `pnpm add <pkg>` | Install a dependency |

## Testing

- PHPUnit 12 with `RefreshDatabase` trait, in-memory SQLite (see `phpunit.xml` DB env vars)
- Auth pattern: `Sanctum::actingAs($user)` in `setUp()` for authenticated tests
- All API test factories create standalone users unless overridden
- Test files: `tests/Feature/Auth/` (register, login, logout), `tests/Feature/Api/` (CRUD per entity)

```bash
composer test                    # all tests
php artisan test --filter=RegisterTest  # single file
```

## Architecture notes

- **API routes** defined in `routes/api.php`. Saving-goals routes are defined twice (lines 27–31 with Sanctum middleware, then lines 42–48 without); the **second group wins** — Sanctum middleware is NOT applied to saving-goals CRUD in the current state. Personal-expense, shared-expense, and task routes also lack `auth:sanctum` middleware.
- **Auth**: Sanctum token-based via `/api/auth/register` and `/api/auth/login`. Google OAuth via Socialite (`/api/auth/google`).
- **Models**: User (has salary, google_id, avatar), SavingGoal, PersonalExpense, SharedExpense, Task.
- **FinancialService** calculates proportional expense shares based on user salaries.
- **Local DB** is SQLite (`database/database.sqlite`). Docker uses PostgreSQL 15.
- `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` all default to `database` driver.
- Error responses are in **Spanish** (e.g., `"Credenciales de inicio de sesión no válidas"`).
- `PersonalExpenseController::destroy` returns 204 with null body; other destroys return 200 with the model.

## Docker

```bash
docker compose up -d            # nginx :8001 → app :9000 + PostgreSQL :5432
```

Nginx serves `backend/public/`, PHP-FPM on `app:9000`.

## Code style

- PHP 8.3+ with Laravel Pint (`laravel/pint`) for formatting
- PHP attributes for Eloquent: `#[Fillable([...])]`, `#[Hidden([...])]`
- `declare(strict_types=1)` not used
