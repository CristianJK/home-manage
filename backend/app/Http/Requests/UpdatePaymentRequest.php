<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shared_expense_id' => ['nullable', 'exists:shared_expenses,id'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'paid_at' => ['sometimes', 'required', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:2048'],
        ];
    }
}
