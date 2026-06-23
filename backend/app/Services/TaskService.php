<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateTaskData;
use App\Models\Task;
use App\Models\User;

final readonly class TaskService
{
    public function create(User $user, CreateTaskData $data): Task
    {
        return Task::create([
            'title' => $data->title,
            'description' => $data->description,
            'status' => $data->status->value,
            'frequency' => $data->frequency,
            'scheduled_at' => $data->scheduledAt,
            'user_id' => $user->id,
        ]);
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
