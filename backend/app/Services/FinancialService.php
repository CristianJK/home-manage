<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\SharedExpensePercentage;
use App\Models\User;
use Illuminate\Support\Collection;

final readonly class FinancialService
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

    public function getOrCreatePercentages(string $month): Collection
    {
        $percentages = SharedExpensePercentage::with('user')
            ->where('month', $month)
            ->get();

        if ($percentages->isNotEmpty()) {
            return $percentages;
        }

        $users = User::where('salary', '>', 0)->get();
        $totalSalary = $users->sum('salary');

        if ($totalSalary <= 0) {
            return collect();
        }

        $users->each(function ($user) use ($totalSalary, $month) {
            $percentage = round(($user->salary / $totalSalary) * 100, 2);
            SharedExpensePercentage::create([
                'user_id' => $user->id,
                'percentage' => $percentage,
                'month' => $month,
            ]);
        });

        return SharedExpensePercentage::with('user')->where('month', $month)->get();
    }
}
