<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shared_expenses', function (Blueprint $table) {
            $table->id();
            $table->string('concept');
            $table->decimal('amount', 15, 2);
            $table->enum('frequency', ['unique', 'monthly', 'yearly', 'biweekly', 'semiannual']);
            $table->date('due_date');
            $table->boolean('is_paid')->default(false);
            $table->string('comment')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_expenses');
    }
};
