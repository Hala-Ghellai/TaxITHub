<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecordResource;
use App\Models\Employee;
use App\Models\Office;
use App\Models\Record;
use App\Support\RecordFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Global employees list. The search box matches employee names OR the
     * titles of records (assignments/tasks) assigned to them.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $employees = Employee::query()
            ->active()
            ->with('department')
            ->when(filled($filters['search'] ?? null), function ($query) use ($filters) {
                $term = trim($filters['search']);
                $query->where(function ($q) use ($term) {
                    $q->where('name', 'like', "%{$term}%")
                        ->orWhereHas('records', fn ($r) => $r->where('title', 'like', "%{$term}%"));
                });
            })
            ->withCount('records')
            ->orderBy('name')
            ->get()
            ->map(fn (Employee $employee) => [
                'id' => $employee->id,
                'name' => $employee->name,
                'job_title' => $employee->job_title,
                'department' => $employee->department?->name,
                'records_count' => $employee->records_count,
            ]);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $filters,
        ]);
    }

    /**
     * Employee profile: all of their assignments and tasks across all
     * offices, with filters.
     */
    public function show(Request $request, Employee $employee): Response
    {
        $filters = $request->validate([
            'type' => ['nullable', 'in:assignment,task'],
            'search' => ['nullable', 'string', 'max:255'],
            'office_id' => ['nullable', 'integer', 'exists:offices,id'],
            'year' => ['nullable', 'integer', 'between:2000,2100'],
            'month' => ['nullable', 'integer', 'between:1,12'],
        ]);

        $records = $employee->records()
            ->with(['office.management', 'employees.department'])
            ->tap(fn ($query) => RecordFilters::apply($query, $filters))
            ->orderByDesc('date')
            ->orderByDesc('records.id')
            ->limit(200)
            ->get();

        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'job_title' => $employee->job_title,
                'department' => $employee->department?->name,
            ],
            'records' => RecordResource::list($records),
            'filters' => $filters,
            'offices' => Office::orderBy('id')->get(['id', 'name']),
            'availableYears' => $this->availableYears(),
        ]);
    }

    private function availableYears(): array
    {
        return Record::query()
            ->pluck('date')
            ->map(fn ($date) => (int) $date->year)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();
    }
}