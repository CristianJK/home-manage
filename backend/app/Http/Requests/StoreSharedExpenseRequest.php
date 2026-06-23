<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreateSharedExpenseData;
use App\Enums\ExpenseFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class StoreSharedExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'concept' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', new Enum(ExpenseFrequency::class)],
            'due_date' => ['required', 'date', 'after_or_equal:today'],
            'comment' => ['nullable', 'string', 'max:255'],
        ];

        if ($this->user()?->isAdmin()) {
            $rules['is_paid'] = ['boolean'];
        }

        return $rules;
    }

    public function toDto(): CreateSharedExpenseData
    {
        return new CreateSharedExpenseData(
            concept: $this->validated('concept'),
            amount: (float) $this->validated('amount'),
            frequency: ExpenseFrequency::from($this->validated('frequency')),
            dueDate: $this->validated('due_date'),
            comment: $this->validated('comment'),
            isPaid: (bool) ($this->validated('is_paid') ?? false),
        );
    }
}
