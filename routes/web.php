<?php

use App\Http\Controllers\Admin\EmployeeController as AdminEmployeeController;
use App\Http\Controllers\Admin\RecordController as AdminRecordController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\RecordDocumentController;
use Illuminate\Support\Facades\Route;

// Landing page: department selector. Requires login.
Route::get('/', [HomeController::class, 'index'])->middleware(['auth'])->name('home');

Route::middleware(['auth'])->group(function () {
    // IT department page -> its employees.
    Route::get('/departments/{department}', [DepartmentController::class, 'show'])
        ->name('departments.show');

    // Offices (tax-authority structure) -> office page -> records table.
    Route::get('/offices', [OfficeController::class, 'index'])->name('offices.index');
    Route::get('/offices/{office}', [OfficeController::class, 'show'])->name('offices.show');

    // Records table for an office + type (assignment|task).
    Route::get('/offices/{office}/records/{type}', [RecordController::class, 'index'])
        ->whereIn('type', ['assignment', 'task'])
        ->name('records.index');

    // Employees (global).
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');

    // Secure PDF streaming (auth only).
    Route::get('/records/{record}/pdf', [RecordDocumentController::class, 'show'])->name('records.pdf');
    Route::get('/records/{record}/tahmish', [RecordDocumentController::class, 'tahmish'])->name('records.tahmish');

    // Profile (Breeze).
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin area: only users with the admin role.
    Route::middleware('can:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminRecordController::class, 'index'])->name('index');
        Route::get('/records/create', [AdminRecordController::class, 'create'])->name('records.create');
        Route::post('/records', [AdminRecordController::class, 'store'])->name('records.store');
        Route::get('/records/{record}/edit', [AdminRecordController::class, 'edit'])->name('records.edit');
        Route::put('/records/{record}', [AdminRecordController::class, 'update'])->name('records.update');
        Route::delete('/records/{record}', [AdminRecordController::class, 'destroy'])->name('records.destroy');

        // Employee management (add / edit / disable).
        Route::get('/employees', [AdminEmployeeController::class, 'index'])->name('employees.index');
        Route::get('/employees/create', [AdminEmployeeController::class, 'create'])->name('employees.create');
        Route::post('/employees', [AdminEmployeeController::class, 'store'])->name('employees.store');
        Route::get('/employees/{employee}/edit', [AdminEmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/employees/{employee}', [AdminEmployeeController::class, 'update'])->name('employees.update');
        Route::post('/employees/{employee}/toggle', [AdminEmployeeController::class, 'toggle'])->name('employees.toggle');
    });
});

require __DIR__.'/auth.php';
