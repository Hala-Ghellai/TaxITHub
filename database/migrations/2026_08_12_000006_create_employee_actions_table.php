<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Activity log for employees: records who added, updated, disabled or
     * re-enabled each employee, so admins can see "recently added" and
     * "disabled" employees at a glance.
     */
    public function up(): void
    {
        Schema::create('employee_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->enum('action', ['added', 'updated', 'disabled', 'enabled']);
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(['employee_id', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_actions');
    }
};