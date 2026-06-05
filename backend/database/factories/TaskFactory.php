<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *#[Fillable(['title', 'description', 'status', 'user_id', 'frequency', 'scheduled_at'])]
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'completed']),
            'user_id' => User::factory(),
            'frequency' => $this->faker->optional()->randomElement(['daily', 'weekly', 'monthly', 'yearly']),
            'scheduled_at' => $this->faker->dateTimeBetween('+1 day', '+1 month'),
        ];
    }
}
