<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreatePaymentData;
use Illuminate\Foundation\Http\FormRequest;

final class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shared_expense_id' => ['nullable', 'exists:shared_expenses,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'paid_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:2048'],
        ];
    }

    public function toDto(): CreatePaymentData
    {
        return new CreatePaymentData(
            amount: (float) $this->validated('amount'),
            paidAt: $this->validated('paid_at'),
            sharedExpenseId: $this->validated('shared_expense_id') !== null ? (int) $this->validated('shared_expense_id') : null,
            notes: $this->validated('notes'),
            photo: $this->validated('photo'),
        );
    }
}
