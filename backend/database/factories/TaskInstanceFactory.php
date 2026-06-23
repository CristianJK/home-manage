<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TaskInstance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaskInstance>
 */
class TaskInstanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'task_id' => Task::factory(),
            'scheduled_date' => $this->faker->dateTimeBetween('today', '+1 month')->format('Y-m-d'),
            'status' => 'pending',
        ];
    }
}
