<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Department extends Model
{
    /**
     * Tax-authority departments (الأقسام) under an office. These are the
     * organization-structure departments seeded from the tax authority
     * hierarchy — distinct from the IT departments (it_departments) that
     * employees belong to.
     */
    protected $fillable = ['name', 'office_id', 'state'];

    /**
     * The office (المكتب) this department belongs to.
     */
    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }
}