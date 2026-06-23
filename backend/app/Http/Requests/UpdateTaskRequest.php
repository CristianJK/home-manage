<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', new Enum(TaskStatus::class)],
            'frequency' => ['nullable', 'string', 'max:255'],
            'scheduled_at' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }
}
