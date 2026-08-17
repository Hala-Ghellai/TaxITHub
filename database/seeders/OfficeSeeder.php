<?php

namespace Database\Seeders;

use App\Models\Office;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OfficeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the tax-authority offices (المكاتب) under their managements.
     */
    public function run(): void
    {
        $data = [
            // الادارة العامة
            ['name' => 'الإدارة العامة', 'management_id' => 1, 'is_management' => 3],
            ['name' => 'إدارة التفتيش', 'management_id' => 1, 'is_management' => 1],
            ['name' => 'إدارة الشؤون الإدارية والمالية', 'management_id' => 1, 'is_management' => 1],
            ['name' => 'إدارة الشؤون الفنية', 'management_id' => 1, 'is_management' => 1],
            ['name' => 'إدارة تقنية المعلومات', 'management_id' => 1, 'is_management' => 1],
            ['name' => 'إدارة محاسبة الإيرادات', 'management_id' => 1],
            ['name' => 'إدارة مكافحة التهرب الضريبي', 'management_id' => 1, 'is_management' => 1],
            ['name' => 'صندوق الرعاية الاجتماعية', 'management_id' => 1],
            ['name' => 'إدارة التخطيط والتطوير', 'management_id' => 1, 'is_management' => 1],
            ['name' => 'مكتب المراقب المالي', 'management_id' => 1],
            ['name' => 'مكتب النشاط الرياضي', 'management_id' => 1],
            ['name' => 'مكتب شؤون رئيس المصلحة', 'management_id' => 1],
            ['name' => 'مكتب الإعلام والتثقيف الضريبي', 'management_id' => 1],
            ['name' => 'مكتب الخبرة والاستشارات', 'management_id' => 1],
            ['name' => 'مكتب الشؤون القانونية', 'management_id' => 1],
            ['name' => 'مكتب المتابعة', 'management_id' => 1],
            ['name' => 'مكتب المراجعة الداخلية', 'management_id' => 1],

            // ادارة طرابلس
            ['name' => 'إدارة طرابلس', 'management_id' => 2, 'is_management' => 1],
            ['name' => 'مكتب سوق الجمعة', 'management_id' => 2],
            ['name' => 'مكتب عين زارة', 'management_id' => 2],
            ['name' => 'مكتب المدينة', 'management_id' => 2],
            ['name' => 'مكتب المواصلات', 'management_id' => 2],
            ['name' => 'مكتب الإسكان والمرافق', 'management_id' => 2],
            ['name' => 'مكتب حي الأندلس', 'management_id' => 2],
            ['name' => 'مكتب هيئة العامة للتسجيل والاستثمار', 'management_id' => 2],
            ['name' => 'مكتب جهاز تنمية وتطوير المراكز الإدارية', 'management_id' => 2],
            ['name' => 'مكتب الإمداد الطبي', 'management_id' => 2],
            ['name' => 'مكتب أبو سليم', 'management_id' => 2],

            // ادارة الجبل الاخضر
            ['name' => 'مكتب البيضاء', 'management_id' => 3, 'is_management' => 1],
            ['name' => 'مكتب شحات', 'management_id' => 3],

            // ادارة الجفرة
            ['name' => 'إدارة هون', 'management_id' => 4, 'is_management' => 1],
            ['name' => 'مكتب ودان', 'management_id' => 4],
            ['name' => 'مكتب زلة', 'management_id' => 4],

            // ادارة بنغازي
            ['name' => 'إدارة بنغازي', 'management_id' => 5, 'is_management' => 1],

            // ادارة وادي الحياة
            ['name' => 'إدارة أوباري', 'management_id' => 6, 'is_management' => 1],
            ['name' => 'مكتب بنت بيه', 'management_id' => 6],

            // ادارة اجدابيا
            ['name' => 'إدارة إجدابيا', 'management_id' => 7, 'is_management' => 1],
            ['name' => 'مكتب أوجلة', 'management_id' => 7],
            ['name' => 'مكتب الزويتينة', 'management_id' => 7],

            // ادارة الجفارة
            ['name' => 'مكتب الزهراء', 'management_id' => 8],
            ['name' => 'مكتب السواني', 'management_id' => 8],
            ['name' => 'إدارة العزيزية', 'management_id' => 8, 'is_management' => 1],
            ['name' => 'مكتب الماية', 'management_id' => 8],
            ['name' => 'مكتب المعمورة', 'management_id' => 8],

            // ادارة الحزام الاخضر
            ['name' => 'مكتب الأبيار', 'management_id' => 9],
            ['name' => 'مكتب توكرا', 'management_id' => 9],
            ['name' => 'مكتب سلوق', 'management_id' => 9],
            ['name' => 'إدارة قمينس', 'management_id' => 9, 'is_management' => 1],

            // ادارة الزاوية
            ['name' => 'إدارة الزاوية', 'management_id' => 10, 'is_management' => 1],
            ['name' => 'مكتب بئر الغنم', 'management_id' => 10],
            ['name' => 'مكتب قرية ناصر', 'management_id' => 10],

            // ادارة الشاطئ
            ['name' => 'إدارة الشاطئ', 'management_id' => 11, 'is_management' => 1],

            // ادارة العجيلات
            ['name' => 'إدارة العجيلات', 'management_id' => 12, 'is_management' => 1],
            ['name' => 'مكتب الجميل', 'management_id' => 12],
            ['name' => 'مكتب تيجي', 'management_id' => 12],
            ['name' => 'مكتب رقدالين', 'management_id' => 12],
            ['name' => 'مكتب زلطن', 'management_id' => 12],

            // ادارة القبة
            ['name' => 'إدارة القبة', 'management_id' => 13, 'is_management' => 1],

            // ادارة الكفرة
            ['name' => 'إدارة الكفرة', 'management_id' => 14, 'is_management' => 1],

            // ادارة المرج
            ['name' => 'إدارة المرج', 'management_id' => 15, 'is_management' => 1],

            // ادارة المرقب
            ['name' => 'إدارة الخمس', 'management_id' => 16, 'is_management' => 1],
            ['name' => 'مكتب سوق الخميس', 'management_id' => 16],

            // ادارة الواحات
            ['name' => 'إدارة جالو', 'management_id' => 17, 'is_management' => 1],
            ['name' => 'مكتب تازربوا', 'management_id' => 17],

            // ادارة بني وليد
            ['name' => 'إدارة بني وليد', 'management_id' => 18, 'is_management' => 1],

            // ادارة تاجوراء
            ['name' => 'إدارة تاجوراء', 'management_id' => 19, 'is_management' => 1],

            // ادارة ترهونة و مسلاتة
            ['name' => 'إدارة ترهونة', 'management_id' => 20, 'is_management' => 1],
            ['name' => 'مكتب القربوللي', 'management_id' => 20],
            ['name' => 'مكتب قصر الأخيار', 'management_id' => 20],
            ['name' => 'مكتب مسلاتة', 'management_id' => 20],

            // ادارة درنة
            ['name' => 'إدارة درنة', 'management_id' => 21, 'is_management' => 1],

            // ادارة زوارة
            ['name' => 'إدارة زوارة', 'management_id' => 22, 'is_management' => 1],
            ['name' => 'مكتب رأس جدير', 'management_id' => 22],

            // ادارة سبها
            ['name' => 'إدارة سبها', 'management_id' => 23, 'is_management' => 1],

            // ادارة سرت
            ['name' => 'إدارة سرت', 'management_id' => 24, 'is_management' => 1],
            ['name' => 'مكتب بن جواد', 'management_id' => 24],

            // ادارة زليتن
            ['name' => 'إدارة زليتن', 'management_id' => 25, 'is_management' => 1],

            // ادارة صبراتة
            ['name' => 'إدارة صبراتة', 'management_id' => 26, 'is_management' => 1],

            // ادارة صرمان
            ['name' => 'إدارة صرمان', 'management_id' => 27, 'is_management' => 1],
            ['name' => 'مكتب أبو عيسى', 'management_id' => 27],

            // ادارة طبرق
            ['name' => 'إدارة طبرق', 'management_id' => 28, 'is_management' => 1],
            ['name' => 'مكتب إمساعد', 'management_id' => 28],

            // ادارة يفرن
            ['name' => 'مكتب الزنتان', 'management_id' => 29],
            ['name' => 'مكتب جادو', 'management_id' => 29],
            ['name' => 'إدارة يفرن', 'management_id' => 29, 'is_management' => 1],
            ['name' => 'مكتب الأصابعة', 'management_id' => 29],
            ['name' => 'مكتب الرياينة', 'management_id' => 29],

            // ادارة جنزور
            ['name' => 'إدارة جنزور', 'management_id' => 30, 'is_management' => 1],
            ['name' => 'مكتب الغد', 'management_id' => 30],

            // ادارة غات
            ['name' => 'إدارة غات', 'management_id' => 31, 'is_management' => 1],

            // ادارة غدامس
            ['name' => 'إدارة غدامس', 'management_id' => 32, 'is_management' => 1],

            // ادارة غريان
            ['name' => 'إدارة غريان', 'management_id' => 33, 'is_management' => 1],
            ['name' => 'مكتب الشقيقة', 'management_id' => 33],

            // ادارة قصر بن غشير
            ['name' => 'إدارة قصر بن غشير', 'management_id' => 34, 'is_management' => 1],
            ['name' => 'مكتب السبيعة', 'management_id' => 34],

            // ادارة مرادة
            ['name' => 'إدارة مرادة', 'management_id' => 35, 'is_management' => 1],

            // ادارة مرزق
            ['name' => 'إدارة مرزق', 'management_id' => 36, 'is_management' => 1],

            // ادارة مزدة
            ['name' => 'إدارة مزدة', 'management_id' => 37, 'is_management' => 1],

            // ادارة مصراتة
            ['name' => 'إدارة مصراتة', 'management_id' => 38, 'is_management' => 1],
            ['name' => 'مكتب المواصلات', 'management_id' => 38],
            ['name' => 'مكتب المطار', 'management_id' => 38],

            // ادارة نالوت
            ['name' => 'إدارة نالوت', 'management_id' => 39, 'is_management' => 1],
            ['name' => 'مكتب الحرابة', 'management_id' => 39],

            // ادارة خليج السدرة
            ['name' => 'إدارة خليج السدرة', 'management_id' => 40, 'is_management' => 1],
        ];

        foreach ($data as $officeData) {
            Office::updateOrCreate(
                ['name' => trim($officeData['name'])],
                $officeData,
            );
        }
    }
}