<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PersonalExpense;
use Illuminate\Http\Request;

class PersonalExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->personalExpense);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
        ]);

        $expense = $request->user()->personalExpense()->create($validated);

        return response()->json($expense, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $expense = PersonalExpense::findOrFail($id);

        $this->authorize('delete', $expense);

        $expense->delete();

        return response()->json(null, 204);
    }
}
