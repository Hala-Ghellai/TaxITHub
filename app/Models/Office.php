<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Office extends Model
{
    protected $fillable = ['name', 'management_id', 'is_management'];

    protected function casts(): array
    {
        return [
            'is_management' => 'integer',
        ];
    }

    /**
     * The management (الإدارة) this office belongs to.
     */
    public function management(): BelongsTo
    {
        return $this->belongsTo(Management::class);
    }

    /**
     * Tax departments (الأقسام) under this office.
     */
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    /**
     * Records directed to this office.
     */
    public function records(): HasMany
    {
        return $this->hasMany(Record::class);
    }
}