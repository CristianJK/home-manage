<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreatePaymentData;
use App\Models\SharedExpensePayment;
use App\Models\User;

final readonly class PaymentService
{
    public function create(User $user, CreatePaymentData $data): SharedExpensePayment
    {
        $payment = SharedExpensePayment::create([
            'user_id' => $user->id,
            'shared_expense_id' => $data->sharedExpenseId,
            'amount' => $data->amount,
            'paid_at' => $data->paidAt,
            'notes' => $data->notes,
            'photo' => $data->photo,
        ]);

        return $payment->load(['user', 'sharedExpense']);
    }

    public function delete(SharedExpensePayment $payment): void
    {
        $payment->delete();
    }
}
