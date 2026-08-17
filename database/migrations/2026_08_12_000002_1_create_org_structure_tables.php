<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tax-authority organization structure: managements (الإدارات) -> offices
     * (المكاتب) -> departments (الأقسام). Records are directed to an office
     * whose hyphenated label becomes "الإدارة الموجّه لها".
     */
    public function up(): void
    {
        Schema::create('managements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('management_id')->constrained('managements')->cascadeOnDelete();
            $table->tinyInteger('is_management')->default(0);
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('office_id')->constrained()->cascadeOnDelete();
            $table->string('state')->default('مفعل');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
        Schema::dropIfExists('offices');
        Schema::dropIfExists('managements');
    }
};