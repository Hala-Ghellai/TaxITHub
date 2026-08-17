<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'name',
        'job_title',
        'department_id',
        'is_active',
        'disabled_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'disabled_at' => 'datetime',
        ];
    }

    /**
     * The employee's home IT department.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(ItDepartment::class, 'department_id');
    }

    /**
     * Records (assignments/tasks) assigned to this employee.
     */
    public function records(): BelongsToMany
    {
        return $this->belongsToMany(Record::class, 'record_assignments')
            ->withTimestamps()
            ->withPivot('id');
    }

    /**
     * Activity log entries for this employee.
     */
    public function actions(): HasMany
    {
        return $this->hasMany(EmployeeAction::class);
    }

    /**
     * Scope: only active (enabled) employees.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: only disabled employees.
     */
    public function scopeDisabled($query)
    {
        return $query->where('is_active', false);
    }
}
