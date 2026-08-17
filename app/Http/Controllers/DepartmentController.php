<?php

namespace App\Http\Controllers;

use App\Models\ItDepartment;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    /**
     * IT department page: shows the employees whose home department is this
     * IT department.
     */
    public function show(ItDepartment $department): Response
    {
        $employees = $department->employees()
            ->active()
            ->withCount('records')
            ->orderBy('name')
            ->get()
            ->map(fn ($employee) => [
                'id' => $employee->id,
                'name' => $employee->name,
                'job_title' => $employee->job_title,
                'records_count' => $employee->records_count,
            ]);

        return Inertia::render('Department/Show', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'description' => $department->description,
            ],
            'employees' => $employees,
        ]);
    }
}