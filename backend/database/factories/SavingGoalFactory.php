<?php

namespace Database\Factories;

use App\Models\SavingGoal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SavingGoal>
 */
class SavingGoalFactory extends Factory
{
    /**
     * Define the model's default state.
     * #[Fillable(['user_id', 'target_name', 'target_amount', 'deadline', 'current_amount'])]
     * #[Hidden(['user_id'])]
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'target_name' => $this->faker->sentence(),
            'category' => $this->faker->optional()->randomElement([
                'emergency', 'travel', 'housing', 'education', 'health', 'investment', 'other'
            ]),
            'target_amount' => $this->faker->randomFloat(2, 1000, 50000),
            'deadline' => $this->faker->dateTimeBetween('now', '+1 year'),
            'current_amount' => $this->faker->randomFloat(2, 0, 50000),
            'user_id' => User::factory()->create()->id,
        ];
    }
}
