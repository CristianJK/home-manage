<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreatePersonalExpenseData;
use App\Models\PersonalExpense;
use App\Models\User;

final readonly class PersonalExpenseService
{
    public function create(User $user, CreatePersonalExpenseData $data): PersonalExpense
    {
        return $user->personalExpense()->create([
            'concept' => $data->concept,
            'amount' => $data->amount,
            'category' => $data->category->value,
        ]);
    }

    public function update(PersonalExpense $expense, CreatePersonalExpenseData $data): PersonalExpense
    {
        $expense->update([
            'concept' => $data->concept,
            'amount' => $data->amount,
            'category' => $data->category->value,
        ]);
        return $expense;
    }

    public function delete(PersonalExpense $expense): void
    {
        $expense->delete();
    }
}
