<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecordResource;
use App\Models\Office;
use App\Models\Record;
use App\Support\RecordFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecordController extends Controller
{
    /**
     * Records table for one office + one type, sorted newest first,
     * with combinable live filters (employee name, year, month).
     */
    public function index(Request $request, Office $office, string $type): Response
    {
        abort_if(! in_array($type, [Record::TYPE_ASSIGNMENT, Record::TYPE_TASK], true), 404);

        $filters = $request->validate([
            'employee_name' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'between:2000,2100'],
            'month' => ['nullable', 'integer', 'between:1,12'],
        ]);

        $records = Record::query()
            ->with(['office.management', 'employees.department'])
            ->where('office_id', $office->id)
            ->where('type', $type)
            ->tap(fn ($query) => RecordFilters::apply($query, $filters))
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(200)
            ->get();

        return Inertia::render('Records/Index', [
            'office' => [
                'id' => $office->id,
                'name' => $office->name,
                'directed_to' => $office->management
                    ? "{$office->management->name} - {$office->name}"
                    : $office->name,
            ],
            'type' => $type,
            'type_label' => $type === Record::TYPE_ASSIGNMENT ? 'تكاليف العمل' : 'مهام العمل',
            'records' => RecordResource::list($records),
            'filters' => $filters,
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