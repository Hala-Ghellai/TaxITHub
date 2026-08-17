<?php

namespace Database\Seeders;

use App\Models\ItDepartment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Users, the IT departments (it_departments) and the tax-authority
     * organization structure (managements -> offices -> departments) are
     * seeded. Employees, تكاليف العمل and مهام العمل are intentionally left
     * empty so that the admin builds everything from scratch.
     */
    public function run(): void
    {
        Storage::disk('local')->deleteDirectory('documents');

        $this->seedUsers();
        $this->seedItDepartments();
        $this->seedOrgStructure();
    }

    private function seedUsers(): void
    {
        User::factory()->create([
            'name' => 'مسؤول النظام',
            'email' => 'admin@tax.gov.ly',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'مستخدم مشاهدة',
            'email' => 'viewer@tax.gov.ly',
            'password' => 'password',
            'role' => 'viewer',
        ]);
    }

    /**
     * The 5 IT departments (أقسام نظم المعلومات) that employees belong to.
     */
    private function seedItDepartments(): void
    {
        $departments = [
            ['name' => 'قسم البرمجة والتطوير', 'description' => 'تطوير وصيانة الأنظمة والتطبيقات'],
            ['name' => 'قسم الشبكات', 'description' => 'تشغيل الشبكات وربط الفروع'],
            ['name' => 'قسم التوثيق والمعلومات', 'description' => 'أرشفة وتوثيق البيانات والمعلومات'],
            ['name' => 'قسم أمن المعلومات', 'description' => 'حماية الأنظمة والشبكات من الاختراقات'],
            ['name' => 'قسم الخدمات الإلكترونية', 'description' => 'تقديم ودعم الخدمات الحكومية الإلكترونية'],
        ];

        foreach ($departments as $dept) {
            ItDepartment::create($dept);
        }
    }

    /**
     * Tax-authority organization structure: managements, offices and the
     * departments under each office.
     */
    private function seedOrgStructure(): void
    {
        $this->call([
            ManagementSeeder::class,
            OfficeSeeder::class,
            DepartmentsTableSeeder::class,
        ]);
    }
}