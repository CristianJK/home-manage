<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use Illuminate\Http\Request;

class SavingGoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->savingGoals);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_name' => 'required|string',
            'target_amount' => 'required|numeric',
            'deadline' => 'required|date',
        ]);

        $goal = $request->user()->savingGoals()->create($validated);
        return response()->json($goal, 201);
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

    public function updateProgress(Request $request, SavingGoal $savingGoal)
    {
        $request->validate(['amount' => 'required|numeric']);

        $savingGoal->increment('current_amount', $request->amount);

        return response()->json($savingGoal);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
