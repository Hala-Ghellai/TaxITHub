<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;

/**
 * Applies the common, combinable (AND) filters used across the records
 * tables (department page, employee profile, admin dashboard).
 */
class RecordFilters
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public static function apply(Builder $query, array $filters): Builder
    {
        // Free-text search: matches the record title OR any assigned employee name.
        if (filled($filters['search'] ?? null)) {
            $term = trim((string) $filters['search']);
            $query->where(function (Builder $q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhereHas('employees', fn (Builder $eq) => $eq->where('name', 'like', "%{$term}%"));
            });
        }

        if (filled($filters['employee_name'] ?? null)) {
            $term = trim((string) $filters['employee_name']);
            $query->whereHas('employees', fn (Builder $eq) => $eq->where('name', 'like', "%{$term}%"));
        }

        if (filled($filters['office_id'] ?? null)) {
            $query->where('office_id', (int) $filters['office_id']);
        }

        if (filled($filters['type'] ?? null)) {
            $query->where('type', $filters['type']);
        }

        if (filled($filters['year'] ?? null)) {
            $query->whereYear('date', (int) $filters['year']);
        }

        if (filled($filters['month'] ?? null)) {
            $query->whereMonth('date', (int) $filters['month']);
        }

        return $query;
    }
}
