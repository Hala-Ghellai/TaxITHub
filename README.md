# نظام إدارة تكاليف العمل ومهام العمل — مصلحة الضرائب الليبية

Internal web application for the Tax Authority's IT Department. It tracks two kinds of employee records:

- **تكاليف العمل (Work Assignments)** — official assignment/commissioning letters (NOT financial costs).
- **مهام العمل (Work Tasks)** — operational tasks assigned to employees.

Built with **Laravel 12 + Inertia.js + React + Tailwind CSS** (RTL, Arabic-first) on MySQL.

## Features

- **Home** — department selector (data-driven, stored in the `departments` table; adding a 6th department requires no code changes).
- **Department page** — pick record type (Work Assignments / Work Tasks) with live counts.
- **Records table** — newest first, with title, date, directed-to department, employees, secure PDF button, and optional **التهميش (marginalia/endorsement)** PDF button. Live combinable (AND) filters: employee name, department, year, month. Responsive (table on desktop, stacked cards on mobile).
- **Employees** — global list searchable by **employee name OR assignment/task title**; each employee has a profile page showing all their assignments and tasks across departments with filters.
- **Admin role** — create/edit/delete records (title, date, directed-to department, main PDF, optional تهميش PDF, multi-employee assignment with a grouped searchable picker). Viewer role is read-only. Admin-only dashboard.
- **Secure PDFs** — documents live in `storage/app/private` (never publicly guessable) and are streamed through authenticated routes only.
- **Theme** — primary red `#BF373E` + complementary deep navy `#1E3A5F` accent on white, soft card shadows, Tajawal Arabic font, full RTL.

## Requirements

- PHP 8.2+
- Composer
- Node.js 20+ / npm
- MySQL (or MariaDB) 8+/10+

## Setup

```bash
# 1. Install PHP + JS dependencies
composer install
npm install

# 2. Configure the database (.env): DB_CONNECTION/mysql, DB_DATABASE, etc.
#    (a new MySQL database will be created by the migration, or create it manually:
#     CREATE DATABASE taxit_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;)

# 3. Generate key, run migrations, and seed demo data (departments, employees,
#    records with dummy PDFs, and the two demo users)
php artisan key:generate
php artisan migrate --seed

# 4. Build the frontend
npm run build

# 5. Serve
php artisan serve   # http://127.0.0.1:8000
```

For development, run `npm run dev` in a second terminal instead of `npm run build`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin (مسؤول) | `admin@tax.gov.ly` | `password` |
| Viewer (مشاهد فقط) | `viewer@tax.gov.ly` | `password` |

New accounts registered through the app are created with the **viewer** role only.

## Key routes

| Method | URI | Purpose |
| --- | --- | --- |
| GET | `/` | Home — department selector |
| GET | `/departments/{department}` | Type selector for a department |
| GET | `/departments/{department}/records/{assignment\|task}` | Records table + filters |
| GET | `/employees` | Global employee search |
| GET | `/employees/{employee}` | Employee profile |
| GET | `/records/{record}/pdf` · `/records/{record}/tahmish` | Secure PDF streaming (auth required) |
| GET/POST/PUT/DELETE | `/admin/records...` | Admin CRUD (admin role only) |

## Testing

```bash
php artisan test   # 34 feature tests covering auth, filters, admin CRUD, PDF security
```

## Project structure (notable pieces)

- `app/Models/` — `Department`, `Employee`, `Record` (single table for both types via the `type` column), `RecordAssignment` (many-to-many), `User` (with `role`).
- `app/Http/Controllers/` — page controllers plus `Admin/RecordController`.
- `app/Http/Resources/RecordResource.php` — normalizes records for the frontend.
- `app/Support/` — `RecordFilters` (shared AND-filter logic) and `DummyPdf` (demo PDF generator).
- `database/seeders/DatabaseSeeder.php` — all demo data.
- `resources/js/` — React SPA: `Layouts/AppLayout.jsx`, reusable `Components` (`RecordsTable`, `FilterBar`, `PdfButton`, ...), and `Pages/{Home,Department,Records,Employees,Admin}`.

## Maintenance / extensibility

- **Add a department**: insert into `departments` — the Home grid renders automatically.
- **Change theme colors**: `tailwind.config.js` `colors.brand` (red) and `colors.navy` (accent).
- **S3 storage**: switch `FILESYSTEM_DISK` to an S3-compatible disk in `.env`; the PDF streaming controller uses Laravel's filesystem abstraction.