<?php

namespace Database\Seeders;

use App\Models\Management;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ManagementSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the tax-authority managements (الإدارات). Insertion order matters:
     * the office seeder references them by the auto-increment id.
     */
    public function run(): void
    {
        $unitNames = [
            'الإدارة العامة',
            'إدارة طرابلس',
            'إدارة الجبل الأخضر',
            'إدارة الجفرة',
            'بنغازي',
            'وادي الحياة',
            'إدارة إجدابيا',
            'إدارة الجفارة',
            'الحزام الأخضر',
            'الزاوية',
            'الشاطئ',
            'العجيلات',
            'القبة',
            'الكفرة',
            'المرج',
            'المرقب',
            'الواحات',
            'بني وليد',
            'تاجوراء',
            'ترهونة ومسلاتة',
            'درنة',
            'زوارة',
            'سبها',
            'سرت',
            'زليتن',
            'صبراتة',
            'صرمان',
            'طبرق',
            'يفرن',
            'جنزور',
            'غات',
            'غدامس',
            'غريان',
            'قصر بن غشير',
            'مرادة',
            'مرزق',
            'مزدة',
            'مصراتة',
            'نالوت',
            'خليج السدرة',
        ];

        foreach ($unitNames as $unitName) {
            Management::create(['name' => trim($unitName)]);
        }
    }
}