<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Record extends Model
{
    public const TYPE_ASSIGNMENT = 'assignment';
    public const TYPE_TASK = 'task';

    protected $fillable = [
        'title',
        'type',
        'date',
        'office_id',
        'pdf_path',
        'tahmish_path',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    /**
     * The office this record is directed to. The "الإدارة الموجّه لها"
     * label is derived as the hyphenated management - office combination.
     */
    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }

    /**
     * The admin user who created the record.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Employees assigned to this record.
     */
    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'record_assignments')
            ->withTimestamps()
            ->withPivot('id');
    }

    /**
     * Human-readable label for the record type.
     */
    public function typeLabel(): string
    {
        return $this->type === self::TYPE_ASSIGNMENT ? 'تكليف عمل' : 'مهمة عمل';
    }

    /**
     * The "الإدارة الموجّه لها" label: the hyphenated management - office.
     */
    public function directedTo(): ?string
    {
        $office = $this->office;

        if (! $office) {
            return null;
        }

        $management = $office->management;

        return $management
            ? "{$management->name} - {$office->name}"
            : $office->name;
    }

    /**
     * Whether this record has an attached endorsement (تهميش) PDF.
     */
    public function hasTahmish(): bool
    {
        return filled($this->tahmish_path);
    }

    /**
     * Whether this record has an attached main document PDF.
     */
    public function hasPdf(): bool
    {
        return filled($this->pdf_path);
    }
}
