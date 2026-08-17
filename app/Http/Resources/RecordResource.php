<?php

namespace App\Http\Resources;

use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Normalizes a Record for the frontend (directed-to office label, assigned
 * employees, secure PDF streaming URLs, type labels, Arabic-formatted date).
 */
class RecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $this->resource->loadMissing(['office.management', 'employees.department']);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'type_label' => $this->typeLabel(),
            'date' => $this->date->format('Y-m-d'),
            'date_label' => $this->date->locale('ar')->translatedFormat('j F Y'),
            'year' => (int) $this->date->year,
            'month' => (int) $this->date->month,
            'directed_to' => $this->directedTo(),
            'office' => [
                'id' => $this->office?->id,
                'name' => $this->office?->name,
            ],
            'employees' => $this->employees->map(fn ($employee) => [
                'id' => $employee->id,
                'name' => $employee->name,
                'department_id' => $employee->department_id,
                'department_name' => $employee->department?->name,
            ])->values(),
            'pdf_url' => $this->hasPdf() ? route('records.pdf', $this) : null,
            'tahmish_url' => $this->hasTahmish() ? route('records.tahmish', $this) : null,
        ];
    }

    /**
     * Serialize a collection of records to a plain, order-preserved array
     * (without the "data" wrapper of ResourceCollection).
     *
     * @param  \Illuminate\Support\Collection<int, \App\Models\Record>  $records
     */
    public static function list($records): array
    {
        return $records
            ->map(fn (Record $record) => (new self($record))->resolve())
            ->values()
            ->all();
    }
}
