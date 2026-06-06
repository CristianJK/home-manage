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
        return response()->json([
            SharedExpense::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
            'is_paid' => 'required|boolean',
            'comment' => 'required|string|max:255',
        ]);

        $validate['user_id'] = $request->user()->id;

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
        ////'concept', 'amount', 'frequency', 'due_date', 'is_paid', 'comment', 'user_id'
        $validate = $request->validate([
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
            'is_paid' => 'required|boolean',
            'comment' => 'nullable|string|max:255',
        ]);

        $sharedExpense = SharedExpense::findOrFail($id);
        $validate['user_id'] = $request->user()->id;
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
