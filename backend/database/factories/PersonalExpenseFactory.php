<?php

namespace Database\Factories;

use App\Models\PersonalExpense;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PersonalExpense>
 */
class PersonalExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *#[Fillable(['user_id', 'concept', 'amount', 'category'])]
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'concept' => $this->faker->word(),
            'amount' => $this->faker->randomFloat(2, 1000, 50000),
            'category' => $this->faker->randomElement(['food', 'transportation', 'housing', 'entertainment', 'other']),
            'user_id' => User::factory(),
        ];
    }
}
