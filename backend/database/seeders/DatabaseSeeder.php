<?php

namespace Database\Seeders;

use App\Models\PersonalExpense;
use App\Models\SavingGoal;
use App\Models\SharedExpense;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Usuario Test',
            'email' => 'test@example.com',
            'salary' => 5000.00,
        ]);

        $user2 = User::factory()->create([
            'name' => 'Usuario Test 1',
            'email' => 'test2@example.com',
            'salary' => 3000.00,
        ]);

        Task::factory(5)->create(['user_id' => $user->id]);
        SharedExpense::factory(10)->create();
        PersonalExpense::factory(5)->create(['user_id' => $user->id]);
        SavingGoal::factory(2)->create(['user_id' => $user->id]);
    }
}
