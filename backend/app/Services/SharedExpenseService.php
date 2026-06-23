<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateSharedExpenseData;
use App\Models\SharedExpense;
use App\Models\User;

final readonly class SharedExpenseService
{
    public function create(User $user, CreateSharedExpenseData $data): SharedExpense
    {
        return SharedExpense::create([
            'concept' => $data->concept,
            'amount' => $data->amount,
            'frequency' => $data->frequency->value,
            'due_date' => $data->dueDate,
            'comment' => $data->comment,
            'is_paid' => $data->isPaid,
            'user_id' => $user->id,
        ]);
    }

    public function delete(SharedExpense $expense): void
    {
        $expense->delete();
    }
}
