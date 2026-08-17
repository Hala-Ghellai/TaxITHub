<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\ItDepartment;
use App\Models\Management;
use App\Models\Office;
use App\Models\Record;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TaxItHubTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    private function viewer(): User
    {
        return User::factory()->create(['role' => 'viewer']);
    }

    private function office(): Office
    {
        $management = Management::create(['name' => 'الإدارة العامة']);
        return Office::create(['name' => 'إدارة تقنية المعلومات', 'management_id' => $management->id]);
    }

    public function test_home_page_lists_it_departments(): void
    {
        ItDepartment::create(['name' => 'قسم البرمجة والتطوير']);

        $this->actingAs($this->viewer())
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('departments', 1)
                ->where('departments.0.name', 'قسم البرمجة والتطوير'));
    }

    public function test_guests_are_redirected_away_from_the_app(): void
    {
        $this->get('/')->assertRedirect(route('login'));
        $this->get('/employees')->assertRedirect(route('login'));
    }

    public function test_office_page_shows_type_selector(): void
    {
        $office = $this->office();
        Record::create([
            'title' => 'تكليف تجريبي',
            'type' => 'assignment',
            'date' => now(),
            'office_id' => $office->id,
            'created_by' => $this->admin()->id,
        ]);

        $this->actingAs($this->viewer())
            ->get("/offices/{$office->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Offices/Show')
                ->where('assignment_count', 1)
                ->where('task_count', 0));
    }

    public function test_records_index_filters_combine(): void
    {
        $admin = $this->admin();
        $office = $this->office();
        $department = ItDepartment::create(['name' => 'قسم البرمجة والتطوير']);
        $employee = Employee::create(['name' => 'دينا صلاح', 'department_id' => $department->id]);

        $record = Record::create([
            'title' => 'تكليف بمتابعة السداد',
            'type' => 'assignment',
            'date' => '2025-03-15',
            'office_id' => $office->id,
            'created_by' => $admin->id,
        ]);
        $record->employees()->attach($employee->id);

        $this->actingAs($this->viewer())
            ->get("/offices/{$office->id}/records/assignment?employee_name=".urlencode('دينا'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Records/Index')
                ->has('records', 1)
                ->where('records.0.title', 'تكليف بمتابعة السداد'));

        // Wrong month -> no results.
        $this->actingAs($this->viewer())
            ->get("/offices/{$office->id}/records/assignment?month=6")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('records', 0));
    }

    public function test_employee_search_by_name_and_title(): void
    {
        $admin = $this->admin();
        $office = $this->office();
        $department = ItDepartment::create(['name' => 'قسم البرمجة والتطوير']);
        $employee = Employee::create(['name' => 'هبة محمود', 'department_id' => $department->id]);

        $record = Record::create([
            'title' => 'تكليف فحص الإقرارات',
            'type' => 'task',
            'date' => now(),
            'office_id' => $office->id,
            'created_by' => $admin->id,
        ]);
        $record->employees()->attach($employee->id);

        $this->actingAs($this->viewer())
            ->get('/employees', ['search' => 'هبة'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('employees', 1));

        $this->actingAs($this->viewer())
            ->get('/employees', ['search' => 'فحص الإقرارات'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('employees', 1));
    }

    public function test_employee_profile_lists_records(): void
    {
        $admin = $this->admin();
        $office = $this->office();
        $department = ItDepartment::create(['name' => 'قسم البرمجة والتطوير']);
        $employee = Employee::create(['name' => 'دينا صلاح', 'department_id' => $department->id]);

        $record = Record::create([
            'title' => 'تكليف متابعة',
            'type' => 'assignment',
            'date' => now(),
            'office_id' => $office->id,
            'created_by' => $admin->id,
        ]);
        $record->employees()->attach($employee->id);

        $this->actingAs($this->viewer())
            ->get("/employees/{$employee->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Employees/Show')
                ->has('records', 1));
    }

    public function test_admin_can_create_a_record_with_pdf(): void
    {
        Storage::fake('local');

        $admin = $this->admin();
        $office = $this->office();
        $employee = Employee::create(['name' => 'أحمد محمد']);

        $this->actingAs($admin)
            ->post('/admin/records', [
                'title' => 'تكليف جديد',
                'type' => 'assignment',
                'date' => '2026-01-01',
                'office_id' => $office->id,
                'pdf' => UploadedFile::fake()->create('doc.pdf', 10, 'application/pdf'),
                'employee_ids' => [$employee->id],
            ])
            ->assertRedirect(route('admin.index'));

        $record = Record::firstWhere('title', 'تكليف جديد');
        $this->assertNotNull($record);
        $this->assertTrue($record->employees()->where('employees.id', $employee->id)->exists());
        Storage::disk('local')->assertExists($record->pdf_path);
    }

    public function test_viewer_cannot_access_admin_area(): void
    {
        $this->actingAs($this->viewer())->get('/admin')->assertForbidden();
        $this->actingAs($this->viewer())->post('/admin/records', [])->assertForbidden();
    }

    public function test_pdf_stream_requires_auth(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('documents/sample.pdf', '%PDF-1.4 fake');

        $record = Record::create([
            'title' => 'مستند تجريبي',
            'type' => 'assignment',
            'date' => now(),
            'office_id' => $this->office()->id,
            'pdf_path' => 'documents/sample.pdf',
            'created_by' => $this->admin()->id,
        ]);

        $this->get("/records/{$record->id}/pdf")->assertRedirect(route('login'));

        $this->actingAs($this->viewer())
            ->get("/records/{$record->id}/pdf")
            ->assertOk()
            ->assertHeader('Content-Type', 'application/pdf');

        $this->assertStringContainsString(
            'inline',
            $this->actingAs($this->viewer())
                ->get("/records/{$record->id}/pdf")
                ->headers->get('Content-Disposition'),
        );
    }

    public function test_admin_can_add_an_employee(): void
    {
        $department = ItDepartment::create(['name' => 'قسم البرمجة والتطوير']);

        $this->actingAs($this->admin())
            ->post('/admin/employees', [
                'name' => 'ليلى محمود',
                'job_title' => 'مطور أنظمة',
                'department_id' => $department->id,
            ])
            ->assertRedirect(route('admin.employees.index'));

        $employee = Employee::firstWhere('name', 'ليلى محمود');
        $this->assertNotNull($employee);
        $this->assertTrue($employee->is_active);
        $this->assertDatabaseHas('employee_actions', [
            'employee_id' => $employee->id,
            'action' => 'added',
        ]);
    }

    public function test_admin_can_edit_an_employee(): void
    {
        $department = ItDepartment::create(['name' => 'قسم البرمجة والتطوير']);
        $employee = Employee::create([
            'name' => 'كريم علي',
            'job_title' => 'محلل',
            'department_id' => $department->id,
        ]);

        $this->actingAs($this->admin())
            ->put("/admin/employees/{$employee->id}", [
                'name' => 'كريم علي الجديد',
                'job_title' => 'محلل أول',
                'department_id' => $department->id,
            ])
            ->assertRedirect(route('admin.employees.index'));

        $this->assertDatabaseHas('employees', ['id' => $employee->id, 'name' => 'كريم علي الجديد']);
        $this->assertDatabaseHas('employee_actions', [
            'employee_id' => $employee->id,
            'action' => 'updated',
        ]);
    }

    public function test_admin_can_disable_and_reenable_an_employee(): void
    {
        $employee = Employee::create(['name' => 'سالم حسن']);

        $this->actingAs($this->admin())
            ->post("/admin/employees/{$employee->id}/toggle")
            ->assertRedirect(route('admin.employees.index'));

        $this->assertDatabaseHas('employees', ['id' => $employee->id, 'is_active' => 0]);
        $this->assertDatabaseHas('employee_actions', [
            'employee_id' => $employee->id,
            'action' => 'disabled',
        ]);

        $this->actingAs($this->admin())
            ->post("/admin/employees/{$employee->id}/toggle")
            ->assertRedirect(route('admin.employees.index'));

        $this->assertDatabaseHas('employees', ['id' => $employee->id, 'is_active' => 1]);
        $this->assertDatabaseHas('employee_actions', [
            'employee_id' => $employee->id,
            'action' => 'enabled',
        ]);
    }

    public function test_disabled_employees_are_hidden_from_public_list(): void
    {
        Employee::create(['name' => 'موظف نشط']);
        Employee::create(['name' => 'موظف معطل', 'is_active' => false, 'disabled_at' => now()]);

        $this->actingAs($this->viewer())
            ->get('/employees')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('employees', 1)
                ->where('employees.0.name', 'موظف نشط'));
    }

    public function test_employee_creation_requires_name_title_and_department(): void
    {
        $this->actingAs($this->admin())
            ->from('/admin/employees/create')
            ->post('/admin/employees', [
                'name' => '',
                'job_title' => '',
                'department_id' => '',
            ])
            ->assertSessionHasErrors(['name', 'job_title', 'department_id'])
            ->assertRedirect('/admin/employees/create');
    }

    public function test_employee_validation_messages_are_in_arabic(): void
    {
        $response = $this->actingAs($this->admin())
            ->from('/admin/employees/create')
            ->post('/admin/employees', [
                'name' => '',
                'job_title' => '',
                'department_id' => '',
            ]);

        $response->assertSessionHasErrors([
            'name' => 'حقل الاسم مطلوب.',
            'job_title' => 'حقل المسمى الوظيفي مطلوب.',
            'department_id' => 'حقل القسم مطلوب.',
        ]);
    }

    public function test_viewer_cannot_manage_employees(): void
    {
        $this->actingAs($this->viewer())
            ->get('/admin/employees')
            ->assertForbidden();

        $this->actingAs($this->viewer())
            ->post('/admin/employees', ['name' => 'ممنوع'])
            ->assertForbidden();
    }
}