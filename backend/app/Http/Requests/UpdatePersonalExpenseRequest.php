<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreatePersonalExpenseData;
use App\Enums\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class UpdatePersonalExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'concept' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'category' => ['required', new Enum(ExpenseCategory::class)],
        ];
    }

    public function toDto(): CreatePersonalExpenseData
    {
        return new CreatePersonalExpenseData(
            concept: $this->validated('concept', $this->input('concept')),
            amount: (float) ($this->validated('amount') ?? $this->input('amount')),
            category: ExpenseCategory::from($this->validated('category') ?? $this->input('category')),
        );
    }
}
