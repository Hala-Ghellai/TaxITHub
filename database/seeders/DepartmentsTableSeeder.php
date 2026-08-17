<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Office;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentsTableSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the tax-authority departments (الأقسام) under their offices.
     * Offices without a defined list get a default "الشؤون الإدارية" قسم.
     */
    public function run(): void
    {
        $departmentsByOfficeName = [
            'إدارة العامة - الشؤون الإدارية والمالية' => [
                'الشؤون الإدارية',
                'قسم الشؤون المالية',
                'قسم شؤون الموظفين',
                'قسم العلاقات العامة',
                'قسم المخازن',
            ],
            'إدارة الشؤون الفنية' => [
                'قسم إصدار المستندات الضريبية',
                'قسم التعاون والاتفاقيات الدولية',
            ],
            'إدارة التفتيش' => [
                'قسم الإشراف والتفتيش',
                'قسم المتابعة والتقارير',
                'أقسام بالإدارات والمناطق',
            ],
            'إدارة الشؤون القانونية' => [
                'قسم شؤون إدارية',
                'قسم العقود',
                'قسم القضايا',
                'قسم القرارات',
                'قسم التحقيقات',
                'قسم الآراء القانونية',
            ],
            'إدارة تقنية المعلومات' => [
                'قسم البرمجة والتطوير',
                'قسم الشبكات والدعم الفني',
                'قسم التوثيق والمعلومات',
                'قسم أمن المعلومات',
                'وحدة الاتصالات',
            ],
            'إدارة مكافحة التهرب الضريبي' => [
                'قسم المعلومات والمتابعة الضبطية',
                'قسم التحقيق ومتابعة الدعاوى القضائية',
            ],
            'إدارة التخطيط والتطوير' => [
                'قسم التدريب والتأهيل',
                'قسم المتابعة والتقييم',
                'قسم البحوث والدراسات',
            ],
            'إدارة محاسبة الإيرادات' => [
                'قسم إدخال البيانات',
                'مطابقة الحسابات',
                'قسم الإحصاء',
                'قسم التدقيق والمراجعة',
            ],
        ];

        $officesWithDefinedDepartments = [];

        foreach ($departmentsByOfficeName as $officeName => $departments) {
            $normalizedOfficeName = trim($officeName);
            $office = Office::whereRaw('TRIM(name) = ?', [$normalizedOfficeName])->first();

            if (! $office) {
                continue;
            }

            $officesWithDefinedDepartments[] = $office->id;

            $normalizedDepartmentNames = array_map('trim', $departments);

            foreach ($normalizedDepartmentNames as $departmentName) {
                Department::firstOrCreate(
                    [
                        'name' => $departmentName,
                        'office_id' => $office->id,
                    ],
                    [
                        'state' => 'مفعل',
                    ],
                );
            }

            // Disable the default department if it is not part of the
            // office's explicitly defined list.
            $normalizedDepartmentNames = array_values(array_unique($normalizedDepartmentNames));
            $placeholders = implode(',', array_fill(0, count($normalizedDepartmentNames), '?'));
            Department::where('office_id', $office->id)
                ->whereRaw('TRIM(name) = ?', ['الشؤون الإدارية'])
                ->whereRaw(
                    'TRIM(name) NOT IN ('.$placeholders.')',
                    $normalizedDepartmentNames,
                )
                ->update(['state' => 'غير مفعل']);
        }

        // Every other office gets a default "الشؤون الإدارية" department.
        $otherOffices = Office::whereNotIn('id', $officesWithDefinedDepartments)->get();

        foreach ($otherOffices as $office) {
            $exists = Department::where('office_id', $office->id)
                ->whereRaw('TRIM(name) = ?', ['الشؤون الإدارية'])
                ->exists();

            if (! $exists) {
                Department::firstOrCreate(
                    [
                        'name' => 'الشؤون الإدارية',
                        'office_id' => $office->id,
                    ],
                    [
                        'state' => 'مفعل',
                    ],
                );
            }
        }
    }
}