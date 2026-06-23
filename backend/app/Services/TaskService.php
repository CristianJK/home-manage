<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateTaskData;
use App\Models\Task;
use App\Models\TaskInstance;
use App\Models\User;
use Carbon\Carbon;

final readonly class TaskService
{
    private const int MAX_INSTANCES = 6;

    public function create(User $user, CreateTaskData $data): Task
    {
        $task = Task::create([
            'title' => $data->title,
            'description' => $data->description,
            'status' => $data->status->value,
            'frequency' => $data->frequency,
            'scheduled_at' => $data->scheduledAt,
            'user_id' => $user->id,
        ]);

        $this->generateInstances($task);

        return $task;
    }

    public function update(Task $task, array $data): Task
    {
        $frequencyChanged = array_key_exists('frequency', $data) && $data['frequency'] !== $task->frequency;
        $scheduledAtChanged = !$frequencyChanged && array_key_exists('scheduled_at', $data) && $data['scheduled_at'] !== Carbon::parse($task->scheduled_at)->toDateString();

        $task->update($data);

        if ($frequencyChanged) {
            $task->instances()->where('status', 'pending')->delete();
            if ($task->frequency) {
                $this->generateInstances($task);
            }
        } elseif ($scheduledAtChanged && !$task->frequency) {
            $task->instances()->where('status', 'pending')->delete();
            $this->generateInstances($task);
        }

        return $task;
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }

    public function generateInstances(Task $task): void
    {
        if (!$task->frequency && !$task->scheduled_at) {
            return;
        }

        if ($task->frequency) {
            $this->generateRecurringInstances($task);
            return;
        }

        if ($task->scheduled_at) {
            $dateStr = Carbon::parse($task->scheduled_at)->toDateString();
            $exists = $task->instances()
                ->where('scheduled_date', $dateStr)
                ->exists();

            if (!$exists) {
                TaskInstance::create([
                    'task_id' => $task->id,
                    'scheduled_date' => $dateStr,
                    'status' => $task->status === 'completed' ? 'completed' : 'pending',
                ]);
            }
        }
    }

    private function generateRecurringInstances(Task $task): void
    {
        $existingDates = $task->instances()
            ->where('scheduled_date', '>=', now()->startOfDay())
            ->pluck('scheduled_date')
            ->map(fn ($d) => $d instanceof Carbon ? $d->toDateString() : $d)
            ->toArray();

        $existingCount = count($existingDates);

        if ($existingCount >= self::MAX_INSTANCES) {
            return;
        }

        $needed = self::MAX_INSTANCES - $existingCount;
        $startDate = $task->scheduled_at
            ? Carbon::parse($task->scheduled_at)->startOfDay()
            : now()->startOfDay();

        if ($startDate->isPast()) {
            $startDate = now()->startOfDay();
        }

        $dates = [];
        $current = $startDate->copy();

        while (count($dates) < $needed) {
            $dateStr = $current->toDateString();

            if (!in_array($dateStr, $existingDates, true)) {
                $dates[] = $dateStr;
                $existingDates[] = $dateStr;
            }

            $current = match ($task->frequency) {
                'daily' => $current->addDay(),
                'weekly' => $current->addWeek(),
                'monthly' => $current->addMonth(),
                'yearly' => $current->addYear(),
                default => $current->addDay(),
            };
        }

        $instances = array_map(fn (string $date) => [
            'task_id' => $task->id,
            'scheduled_date' => $date,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ], $dates);

        TaskInstance::insert($instances);
    }

    public function generatePendingInstances(): void
    {
        Task::whereNotNull('frequency')->chunk(50, function ($tasks) {
            foreach ($tasks as $task) {
                $this->generateInstances($task);
            }
        });
    }
}
