<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePercentageRequest;
use App\Services\FinancialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class SharedExpensePercentageController extends Controller
{
    public function __construct(
        private readonly FinancialService $financialService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $month = $request->query('month', now()->format('Y-m-d'));
        $month = date('Y-m-01', strtotime((string) $month));

        $percentages = $this->financialService->getOrCreatePercentages($month);

        return response()->json([
            'month' => $month,
            'users' => $percentages->map(fn ($p) => [
                'user_id' => $p->user_id,
                'name' => $p->user->name,
                'salary' => (float) ($p->user->salary ?? 0),
                'percentage' => (float) $p->percentage,
            ]),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $month = $request->query('month', now()->format('Y-m-d'));
        $month = date('Y-m-01', strtotime((string) $month));

        $validated = $request->validate([
            'users' => 'required|array|min:1',
            'users.*.user_id' => 'required|exists:users,id',
            'users.*.percentage' => 'required|numeric|min:0|max:100',
        ]);

        $percentages = $validated['users'];
        $total = array_sum(array_column($percentages, 'percentage'));

        if (round($total, 2) !== 100.00) {
            return response()->json([
                'errors' => ['percentage' => ['Los porcentajes deben sumar 100%.']],
            ], 422);
        }

        foreach ($percentages as $data) {
            \App\Models\SharedExpensePercentage::updateOrCreate(
                ['user_id' => $data['user_id'], 'month' => $month],
                ['percentage' => $data['percentage']],
            );
        }

        $updated = \App\Models\SharedExpensePercentage::with('user')
            ->where('month', $month)
            ->get();

        return response()->json([
            'month' => $month,
            'users' => $updated->map(fn ($p) => [
                'user_id' => $p->user_id,
                'name' => $p->user->name,
                'salary' => (float) ($p->user->salary ?? 0),
                'percentage' => (float) $p->percentage,
            ]),
        ]);
    }
}
