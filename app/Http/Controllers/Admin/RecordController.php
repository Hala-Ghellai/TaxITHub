<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecordRequest;
use App\Http\Resources\RecordResource;
use App\Models\Employee;
use App\Models\Management;
use App\Models\Office;
use App\Models\Record;
use App\Support\RecordFilters;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RecordController extends Controller
{
    /**
     * Admin dashboard: all records with filters and management actions.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'type' => ['nullable', 'in:assignment,task'],
            'search' => ['nullable', 'string', 'max:255'],
            'employee_name' => ['nullable', 'string', 'max:255'],
            'office_id' => ['nullable', 'integer', 'exists:offices,id'],
            'year' => ['nullable', 'integer', 'between:2000,2100'],
            'month' => ['nullable', 'integer', 'between:1,12'],
        ]);

        $records = Record::query()
            ->with(['office.management', 'employees.department'])
            ->tap(fn ($query) => RecordFilters::apply($query, $filters))
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(300)
            ->get();

        return Inertia::render('Admin/Index', [
            'records' => RecordResource::list($records),
            'filters' => $filters,
            'stats' => [
                'total' => Record::count(),
                'assignments' => Record::where('type', 'assignment')->count(),
                'tasks' => Record::where('type', 'task')->count(),
                'employees' => Employee::count(),
            ],
            'offices' => $this->offices(),
        ]);
    }

    /**
     * Create form. `type` may be preselected via query string.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Form', [
            'mode' => 'create',
            'initialType' => $request->query('type', null),
            ...$this->formData(),
        ]);
    }

    public function store(RecordRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $record = Record::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'date' => $validated['date'],
            'office_id' => $validated['office_id'],
            'pdf_path' => $this->storeFile($request, 'pdf'),
            'tahmish_path' => $this->storeFile($request, 'tahmish'),
            'created_by' => $request->user()->id,
        ]);

        $record->employees()->attach($validated['employee_ids']);

        return Redirect::route('admin.index')->with('success', 'تمت إضافة السجل بنجاح.');
    }

    /**
     * Edit form.
     */
    public function edit(Record $record): Response
    {
        return Inertia::render('Admin/Form', [
            'mode' => 'edit',
            'record' => (new RecordResource($record->load(['office.management', 'employees'])))->resolve(),
            ...$this->formData(),
        ]);
    }

    public function update(RecordRequest $request, Record $record): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('pdf')) {
            $this->deleteFile($record->pdf_path);
            $record->pdf_path = $this->storeFile($request, 'pdf');
        }

        if ($request->hasFile('tahmish')) {
            $this->deleteFile($record->tahmish_path);
            $record->tahmish_path = $this->storeFile($request, 'tahmish');
        }

        $record->update([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'date' => $validated['date'],
            'office_id' => $validated['office_id'],
        ]);

        $record->employees()->sync($validated['employee_ids']);

        return Redirect::route('admin.index')->with('success', 'تم تحديث السجل بنجاح.');
    }

    public function destroy(Record $record): RedirectResponse
    {
        $this->deleteFile($record->pdf_path);
        $this->deleteFile($record->tahmish_path);

        $record->delete();

        return Redirect::route('admin.index')->with('success', 'تم حذف السجل.');
    }

    /**
     * Shared data for the create/edit forms: managements + offices (for the
     * cascading "الإدارة الموجّه لها" combo boxes) and employees grouped by
     * their home IT department (for a grouped multi-select).
     */
    private function formData(): array
    {
        $managements = Management::orderBy('id')->get(['id', 'name'])->toArray();
        $offices = $this->offices();

        $employeeGroups = Employee::query()
            ->active()
            ->with('department')
            ->orderBy('name')
            ->get()
            ->groupBy('department_id')
            ->map(fn ($group) => [
                'department_id' => $group->first()->department_id,
                'department' => $group->first()->department?->name ?? 'بدون إدارة',
                'employees' => $group->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'job_title' => $employee->job_title,
                ])->values(),
            ])
            ->values();

        return [
            'managements' => $managements,
            'offices' => $offices,
            'employeeGroups' => $employeeGroups,
        ];
    }

    /**
     * All offices for the filter dropdown / combo boxes.
     */
    private function offices(): array
    {
        return Office::query()
            ->with('management')
            ->orderBy('id')
            ->get()
            ->map(fn (Office $office) => [
                'id' => $office->id,
                'name' => $office->name,
                'management_id' => $office->management_id,
                'management_name' => $office->management?->name,
                'directed_to' => $office->management
                    ? "{$office->management->name} - {$office->name}"
                    : $office->name,
            ])
            ->toArray();
    }

    private function storeFile(Request $request, string $field): ?string
    {
        if (! $request->hasFile($field)) {
            return null;
        }

        return $request->file($field)->store('documents', ['disk' => 'local', 'visibility' => 'private']);
    }

    private function deleteFile(?string $path): void
    {
        if (filled($path) && Storage::disk('local')->exists($path)) {
            Storage::disk('local')->delete($path);
        }
    }
}
