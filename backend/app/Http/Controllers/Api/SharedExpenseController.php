<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SharedExpense;
use Illuminate\Http\Request;

class SharedExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(SharedExpense::all());
    }

    public function withPayments()
    {
        return response()->json(
            SharedExpense::with('payments.user')->latest('due_date')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
            'comment' => 'nullable|string|max:255',
        ];

        if ($request->user()->isAdmin()) {
            $rules['is_paid'] = 'boolean';
        }

        $validate = $request->validate($rules);
        $validate['user_id'] = $request->user()->id;

        if (!array_key_exists('is_paid', $validate)) {
            $validate['is_paid'] = false;
        }

        $sharedExpense = SharedExpense::create($validate);

        return response()->json($sharedExpense, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sharedExpense = SharedExpense::findOrFail($id);
        return response()->json($sharedExpense);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rules = [
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
            'comment' => 'nullable|string|max:255',
        ];

        if ($request->user()->isAdmin()) {
            $rules['is_paid'] = 'required|boolean';
        }

        $validate = $request->validate($rules);

        $sharedExpense = SharedExpense::findOrFail($id);
        $sharedExpense->update($validate);

        return response()->json($sharedExpense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sharedExpense = SharedExpense::findOrFail($id);
        $sharedExpense->delete();
        return response()->json($sharedExpense);
    }
}
