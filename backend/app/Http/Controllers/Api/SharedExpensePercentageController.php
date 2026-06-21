<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SharedExpensePercentage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SharedExpensePercentageController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m-d'));
        $month = date('Y-m-01', strtotime($month));

        $percentages = SharedExpensePercentage::with('user')
            ->where('month', $month)
            ->get();

        if ($percentages->isNotEmpty()) {
            return response()->json([
                'month' => $month,
                'users' => $percentages->map(fn ($p) => [
                    'user_id' => $p->user_id,
                    'name' => $p->user->name,
                    'percentage' => (float) $p->percentage,
                ]),
            ]);
        }

        $users = User::where('salary', '>', 0)->get();
        $totalSalary = $users->sum('salary');

        if ($totalSalary <= 0) {
            return response()->json([
                'month' => $month,
                'users' => [],
            ]);
        }

        $defaults = $users->map(function ($user) use ($totalSalary, $month) {
            $percentage = round(($user->salary / $totalSalary) * 100, 2);
            SharedExpensePercentage::create([
                'user_id' => $user->id,
                'percentage' => $percentage,
                'month' => $month,
            ]);
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'percentage' => $percentage,
            ];
        });

        return response()->json([
            'month' => $month,
            'users' => $defaults,
        ]);
    }

    public function update(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m-d'));
        $month = date('Y-m-01', strtotime($month));

        $validator = Validator::make($request->all(), [
            'users' => 'required|array|min:1',
            'users.*.user_id' => 'required|exists:users,id',
            'users.*.percentage' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $percentages = $request->input('users');
        $total = array_sum(array_column($percentages, 'percentage'));

        if (round($total, 2) !== 100.00) {
            return response()->json([
                'errors' => ['percentage' => ['Los porcentajes deben sumar 100%.']],
            ], 422);
        }

        foreach ($percentages as $data) {
            SharedExpensePercentage::updateOrCreate(
                ['user_id' => $data['user_id'], 'month' => $month],
                ['percentage' => $data['percentage']],
            );
        }

        $updated = SharedExpensePercentage::with('user')
            ->where('month', $month)
            ->get();

        return response()->json([
            'month' => $month,
            'users' => $updated->map(fn ($p) => [
                'user_id' => $p->user_id,
                'name' => $p->user->name,
                'percentage' => (float) $p->percentage,
            ]),
        ]);
    }
}
