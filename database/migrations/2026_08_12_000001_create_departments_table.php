<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * IT departments (أقسام نظم المعلومات) are the "home" departments that
     * employees belong to. They are separate from the tax-authority
     * departments (managements -> offices -> departments) hierarchy.
     */
    public function up(): void
    {
        Schema::create('it_departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('it_departments');
    }
};
