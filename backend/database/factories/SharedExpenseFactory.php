<?php

namespace Database\Factories;

use App\Models\SharedExpense;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SharedExpense>
 */
class SharedExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *#[Fillable(['concept', 'amount', 'frequency', 'due_date', 'is_paid', 'comment'])]
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'concept' => $this->faker->randomElement(['rent', 'water', 'electricity', 'internet', 'gas', 'other']),
            'amount' => $this->faker->randomFloat(2, 1000, 50000),
            'frequency' => $this->faker->randomElement(['monthly', 'semiannual', 'yearly']),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'is_paid' => $this->faker->boolean(50),
            'comment' => $this->faker->optional()->sentence(),
            'user_id' => User::factory()->create()->id,
        ];
    }
}
