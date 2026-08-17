<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItDepartment extends Model
{
    protected $table = 'it_departments';

    protected $fillable = ['name', 'description'];

    /**
     * Employees whose home department is this IT department.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'department_id');
    }
}