<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;
use App\Models\EmployeeAction;
use App\Models\ItDepartment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Employee management dashboard: searchable list of employees, stats, and
     * a log of recent additions and disabled employees.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:all,active,disabled'],
        ]);

        $employees = Employee::query()
            ->with('department')
            ->withCount('records')
            ->when(filled($filters['search'] ?? null), function ($query) use ($filters) {
                $query->where('name', 'like', '%'.trim($filters['search']).'%');
            })
            ->when(($filters['status'] ?? 'all') === 'active', fn ($query) => $query->active())
            ->when(($filters['status'] ?? 'all') === 'disabled', fn ($query) => $query->disabled())
            ->orderBy('name')
            ->get()
            ->map(fn (Employee $employee) => $this->payload($employee));

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'filters' => $filters,
            'stats' => [
                'total' => Employee::count(),
                'active' => Employee::active()->count(),
                'disabled' => Employee::disabled()->count(),
            ],
            'log' => [
                'recentAdded' => EmployeeAction::query()
                    ->where('action', 'added')
                    ->with(['employee.department', 'performer'])
                    ->latest()
                    ->limit(6)
                    ->get()
                    ->map(fn (EmployeeAction $action) => $this->logPayload($action)),
                'disabled' => Employee::disabled()
                    ->with('department')
                    ->orderByDesc('disabled_at')
                    ->limit(10)
                    ->get()
                    ->map(fn (Employee $employee) => [
                        ...$this->payload($employee),
                        'disabled_at' => $employee->disabled_at?->format('Y-m-d'),
                    ]),
                'activities' => EmployeeAction::query()
                    ->with(['employee', 'performer'])
                    ->latest()
                    ->limit(20)
                    ->get()
                    ->map(fn (EmployeeAction $action) => $this->logPayload($action)),
            ],
        ]);
    }

    /**
     * Create form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Employees/Form', [
            'mode' => 'create',
            'departments' => $this->departments(),
        ]);
    }

    public function store(EmployeeRequest $request): RedirectResponse
    {
        $employee = Employee::create($request->validated());

        EmployeeAction::create([
            'employee_id' => $employee->id,
            'action' => 'added',
            'performed_by' => $request->user()->id,
        ]);

        return Redirect::route('admin.employees.index')
            ->with('success', "تمت إضافة الموظف «{$employee->name}» بنجاح.");
    }

    /**
     * Edit form.
     */
    public function edit(Employee $employee): Response
    {
        return Inertia::render('Admin/Employees/Form', [
            'mode' => 'edit',
            'employee' => $this->payload($employee->loadCount('records')),
            'departments' => $this->departments(),
        ]);
    }

    public function update(EmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $employee->update($request->validated());

        EmployeeAction::create([
            'employee_id' => $employee->id,
            'action' => 'updated',
            'performed_by' => $request->user()->id,
        ]);

        return Redirect::route('admin.employees.index')
            ->with('success', "تم تحديث بيانات الموظف «{$employee->name}» بنجاح.");
    }

    /**
     * Toggle an employee between enabled and disabled. Disabled employees are
     * hidden from the public lists and from new record assignments.
     */
    public function toggle(Request $request, Employee $employee): RedirectResponse
    {
        if ($employee->is_active) {
            $employee->update(['is_active' => false, 'disabled_at' => now()]);
            EmployeeAction::create([
                'employee_id' => $employee->id,
                'action' => 'disabled',
                'performed_by' => $request->user()->id,
            ]);

            return Redirect::route('admin.employees.index')
                ->with('success', "تم تعطيل الموظف «{$employee->name}».");
        }

        $employee->update(['is_active' => true, 'disabled_at' => null]);
        EmployeeAction::create([
            'employee_id' => $employee->id,
            'action' => 'enabled',
            'performed_by' => $request->user()->id,
        ]);

        return Redirect::route('admin.employees.index')
            ->with('success', "تم تفعيل الموظف «{$employee->name}».");
    }

    private function departments(): array
    {
        return ItDepartment::orderBy('id')->get(['id', 'name'])->toArray();
    }

    private function payload(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'name' => $employee->name,
            'job_title' => $employee->job_title,
            'department' => $employee->department?->name,
            'department_id' => $employee->department_id,
            'records_count' => $employee->records_count ?? 0,
            'is_active' => $employee->is_active,
            'disabled_at' => $employee->disabled_at?->format('Y-m-d'),
        ];
    }

    private function logPayload(EmployeeAction $action): array
    {
        return [
            'id' => $action->id,
            'action' => $action->action,
            'note' => $action->note,
            'created_at' => $action->created_at?->format('Y-m-d H:i'),
            'employee' => $action->employee ? [
                'id' => $action->employee->id,
                'name' => $action->employee->name,
                'job_title' => $action->employee->job_title,
                'department' => $action->employee->department?->name,
            ] : null,
            'performer' => $action->performer?->name,
        ];
    }
}