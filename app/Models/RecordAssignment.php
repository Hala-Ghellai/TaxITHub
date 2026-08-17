<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecordAssignment extends Model
{
    protected $fillable = ['record_id', 'employee_id'];

    public function record(): BelongsTo
    {
        return $this->belongsTo(Record::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
