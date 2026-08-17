<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Records cover both Work Assignments (تكاليف العمل) and Work Tasks
     * (مهام العمل) distinguished by the `type` column. PDFs are stored on
     * the private filesystem disk and are never publicly URL-addressable.
     */
    public function up(): void
    {
        Schema::create('records', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['assignment', 'task'])->default('assignment');
            $table->date('date');
            // The office the assignment/task is directed to
            // (الإدارة الموجّه لها = management name - office name).
            $table->foreignId('office_id')->constrained()->cascadeOnDelete();
            $table->string('pdf_path')->nullable();
            $table->string('tahmish_path')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['type', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('records');
    }
};
