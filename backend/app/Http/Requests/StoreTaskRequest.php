<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreateTaskData;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', new Enum(TaskStatus::class)],
            'frequency' => ['nullable', 'string', 'max:255'],
            'scheduled_at' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function toDto(): CreateTaskData
    {
        return new CreateTaskData(
            title: $this->validated('title'),
            description: $this->validated('description'),
            status: TaskStatus::from($this->validated('status')),
            frequency: $this->validated('frequency'),
            scheduledAt: $this->validated('scheduled_at'),
        );
    }
}
