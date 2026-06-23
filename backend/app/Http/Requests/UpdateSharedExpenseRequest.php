<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ExpenseFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class UpdateSharedExpenseRequest extends FormRequest
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
            $rules['is_paid'] = ['sometimes', 'required', 'boolean'];
        }

        return $rules;
    }
}
