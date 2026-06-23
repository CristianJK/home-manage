<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateSavingGoalData;
use App\Models\SavingGoal;
use App\Models\User;

final readonly class SavingGoalService
{
    public function create(User $user, CreateSavingGoalData $data): SavingGoal
    {
        return $user->savingGoals()->create([
            'target_name' => $data->targetName,
            'category' => $data->category,
            'target_amount' => $data->targetAmount,
            'deadline' => $data->deadline,
            'current_amount' => $data->currentAmount ?? 0,
        ]);
    }

    public function update(SavingGoal $goal, CreateSavingGoalData $data): SavingGoal
    {
        $goal->update([
            'target_name' => $data->targetName,
            'category' => $data->category,
            'target_amount' => $data->targetAmount,
            'deadline' => $data->deadline,
            'current_amount' => $data->currentAmount ?? $goal->current_amount,
        ]);
        return $goal;
    }

    public function delete(SavingGoal $goal): void
    {
        $goal->delete();
    }
}
