<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreateSavingGoalData;
use Illuminate\Foundation\Http\FormRequest;

final class StoreSavingGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'target_name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'deadline' => ['required', 'date'],
            'current_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function toDto(): CreateSavingGoalData
    {
        return new CreateSavingGoalData(
            targetName: $this->validated('target_name'),
            category: $this->validated('category'),
            targetAmount: (float) $this->validated('target_amount'),
            deadline: $this->validated('deadline'),
            currentAmount: $this->validated('current_amount') !== null ? (float) $this->validated('current_amount') : null,
        );
    }
}
