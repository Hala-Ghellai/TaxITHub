<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\ItDepartment;
use App\Models\Record;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Landing page: shows the IT-department selector cards with the number
     * of employees in each department.
     */
    public function index(): Response
    {
        $departments = ItDepartment::query()
            ->withCount('employees')
            ->orderBy('id')
            ->get()
            ->map(fn (ItDepartment $department) => [
                'id' => $department->id,
                'name' => $department->name,
                'description' => $department->description,
                'employees_count' => $department->employees_count,
            ]);

        return Inertia::render('Home', [
            'departments' => $departments,
            'stats' => [
                'departments' => ItDepartment::count(),
                'employees' => Employee::count(),
                'assignments' => Record::where('type', 'assignment')->count(),
                'tasks' => Record::where('type', 'task')->count(),
            ],
        ]);
    }
}