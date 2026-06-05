<?php

namespace App\Services;

use App\Models\User;

class FinancialService
{
    public function calculateProportionalShare(float $totalAmount): array
    {
        $users = User::all(['id', 'name', 'salary']);
        $totalSalaries = $users->sum('salary');
        if ($totalSalaries <= 0) {
            return [];
        }
        return $users->map(function ($user) use ($totalSalaries, $totalAmount) {
            $percentage = $user->salary / $totalSalaries;
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'share' => round($percentage * $totalAmount, 2),
                'percentage' => round($percentage * 100, 2)
            ];
        })->toArray();
    }
}
