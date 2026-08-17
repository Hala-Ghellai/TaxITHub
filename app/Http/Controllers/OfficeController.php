<?php

namespace App\Http\Controllers;

use App\Models\Management;
use App\Models\Office;
use App\Models\Record;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    /**
     * Offices list, grouped by management (الإدارة). This is the entry point
     * to browse the tax-authority structure and its records.
     */
    public function index(): Response
    {
        $managements = Management::query()
            ->with(['offices' => fn ($query) => $query->withCount('records')->orderBy('name')])
            ->orderBy('id')
            ->get()
            ->map(fn (Management $management) => [
                'id' => $management->id,
                'name' => $management->name,
                'offices' => $management->offices->map(fn (Office $office) => [
                    'id' => $office->id,
                    'name' => $office->name,
                    'records_count' => $office->records_count,
                ])->values(),
            ]);

        return Inertia::render('Offices/Index', [
            'managements' => $managements,
        ]);
    }

    /**
     * Office page: shows the office's tax departments (الأقسام) and the two
     * record-type selector cards with their counts.
     */
    public function show(Office $office): Response
    {
        $office->load(['management', 'departments']);

        $departments = $office->departments
            ->sortBy('name')
            ->values()
            ->map(fn ($department) => [
                'id' => $department->id,
                'name' => $department->name,
                'state' => $department->state,
            ]);

        return Inertia::render('Offices/Show', [
            'office' => [
                'id' => $office->id,
                'name' => $office->name,
                'management' => $office->management?->name,
                'directed_to' => $office->management
                    ? "{$office->management->name} - {$office->name}"
                    : $office->name,
            ],
            'departments' => $departments,
            'assignment_count' => $office->records()->where('type', Record::TYPE_ASSIGNMENT)->count(),
            'task_count' => $office->records()->where('type', Record::TYPE_TASK)->count(),
        ]);
    }
}