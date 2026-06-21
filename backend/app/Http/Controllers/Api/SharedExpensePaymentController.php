<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SharedExpensePayment;
use Illuminate\Http\Request;

class SharedExpensePaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = SharedExpensePayment::with('user');

        if ($request->query('month')) {
            $month = date('Y-m', strtotime($request->query('month')));
            $query->where('paid_at', 'like', "$month%");
        }

        return response()->json($query->latest('paid_at')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'shared_expense_id' => 'nullable|exists:shared_expenses,id',
            'amount' => 'required|numeric|min:0',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string|max:255',
        ]);

        $payment = SharedExpensePayment::create($validated);

        return response()->json($payment->load('user'), 201);
    }

    public function show(string $id)
    {
        $payment = SharedExpensePayment::with('user')->findOrFail($id);
        return response()->json($payment);
    }

    public function update(Request $request, string $id)
    {
        $payment = SharedExpensePayment::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'shared_expense_id' => 'nullable|exists:shared_expenses,id',
            'amount' => 'sometimes|numeric|min:0',
            'paid_at' => 'sometimes|date',
            'notes' => 'nullable|string|max:255',
        ]);

        $payment->update($validated);

        return response()->json($payment->load('user'));
    }

    public function destroy(string $id)
    {
        $payment = SharedExpensePayment::findOrFail($id);
        $payment->delete();
        return response()->json($payment);
    }
}
