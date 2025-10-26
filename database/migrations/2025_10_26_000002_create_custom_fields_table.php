<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custom_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('field_group_id')->constrained('field_groups')->onDelete('cascade');
            $table->string('label');
            $table->string('name');
            $table->string('key')->unique();
            $table->string('type'); // text, textarea, number, email, select, checkbox, radio, date, etc.
            $table->text('instructions')->nullable();
            $table->boolean('required')->default(false);
            $table->json('default_value')->nullable();
            $table->string('placeholder')->nullable();
            $table->json('choices')->nullable(); // For select, checkbox, radio fields (key-value pairs)
            $table->boolean('multiple')->default(false); // For select fields
            $table->json('conditional_logic')->nullable();
            $table->json('wrapper')->nullable(); // Width, class, id
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_fields');
    }
};
