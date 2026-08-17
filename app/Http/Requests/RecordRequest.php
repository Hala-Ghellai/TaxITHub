<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecordRequest extends FormRequest
{
    /**
     * Only admin users may create/update records.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $pdfRules = ['nullable', 'file', 'mimes:pdf', 'max:10240'];

        if ($this->isMethod('post')) {
            $pdfRules[0] = 'required';
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:assignment,task'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'office_id' => ['required', 'integer', 'exists:offices,id'],
            'pdf' => $pdfRules,
            'tahmish' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'employee_ids' => ['required', 'array', 'min:1'],
            'employee_ids.*' => ['integer', 'exists:employees,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'عنوان التكليف مطلوب.',
            'date.required' => 'التاريخ مطلوب.',
            'date.before_or_equal' => 'لا يمكن أن يكون التاريخ بعد تاريخ اليوم.',
            'office_id.required' => 'اختر الإدارة الموجّه إليها.',
            'pdf.required' => 'ملف PDF الخاص بالمستند مطلوب.',
            'pdf.mimes' => 'يجب أن يكون الملف بصيغة PDF.',
            'pdf.max' => 'حجم الملف يجب ألا يتجاوز 10 ميجابايت.',
            'tahmish.mimes' => 'يجب أن يكون ملف التهميش بصيغة PDF.',
            'employee_ids.required' => 'اختر موظفاً واحداً على الأقل.',
        ];
    }
}
