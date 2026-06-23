<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SharedExpensePayment;
use Illuminate\Http\Request;

class SharedExpensePaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = SharedExpensePayment::with(['user', 'sharedExpense'])->where('user_id', auth()->id());

        if ($request->query('month')) {
            $month = date('Y-m', strtotime($request->query('month')));
            $query->where('paid_at', 'like', "$month%");
        }

        return response()->json($query->latest('paid_at')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shared_expense_id' => 'nullable|exists:shared_expenses,id',
            'amount' => 'required|numeric|min:0',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string|max:255',
            'photo' => 'nullable|string|max:2048',
        ]);

        $validated['user_id'] = auth()->id();

        $payment = SharedExpensePayment::create($validated);

        return response()->json($payment->load(['user', 'sharedExpense']), 201);
    }

    public function show(string $id)
    {
        $payment = SharedExpensePayment::with(['user', 'sharedExpense'])->findOrFail($id);
        return response()->json($payment);
    }

    public function update(Request $request, string $id)
    {
        $payment = SharedExpensePayment::findOrFail($id);

        $validated = $request->validate([
            'shared_expense_id' => 'nullable|exists:shared_expenses,id',
            'amount' => 'sometimes|numeric|min:0',
            'paid_at' => 'sometimes|date',
            'notes' => 'nullable|string|max:255',
            'photo' => 'nullable|string|max:2048',
        ]);

        $payment->update($validated);

        return response()->json($payment->load(['user', 'sharedExpense']));
    }

    public function destroy(string $id)
    {
        $payment = SharedExpensePayment::findOrFail($id);
        $payment->delete();
        return response()->json($payment);
    }
}
