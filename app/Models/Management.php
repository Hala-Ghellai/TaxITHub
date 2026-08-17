<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Management extends Model
{
    protected $table = 'managements';

    protected $fillable = ['name'];

    /**
     * Offices that belong to this management.
     */
    public function offices(): HasMany
    {
        return $this->hasMany(Office::class);
    }
}