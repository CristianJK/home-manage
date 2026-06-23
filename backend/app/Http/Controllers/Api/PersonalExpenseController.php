<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePersonalExpenseRequest;
use App\Http\Requests\UpdatePersonalExpenseRequest;
use App\Http\Resources\PersonalExpenseResource;
use App\Models\PersonalExpense;
use App\Services\PersonalExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PersonalExpenseController extends Controller
{
    public function __construct(
        private readonly PersonalExpenseService $expenseService,
    ) {}

    public function index(Request $request)
    {
        return PersonalExpenseResource::collection(
            $request->user()->personalExpense()->latest()->get()
        );
    }

    public function store(StorePersonalExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->create(
            $request->user(),
            $request->toDto(),
        );

        return (new PersonalExpenseResource($expense))
            ->response()
            ->setStatusCode(201);
    }

    public function show(PersonalExpense $expense): PersonalExpenseResource
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }
        return new PersonalExpenseResource($expense);
    }

    public function update(UpdatePersonalExpenseRequest $request, PersonalExpense $expense): PersonalExpenseResource
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }
        $expense = $this->expenseService->update($expense, $request->toDto());
        return new PersonalExpenseResource($expense);
    }

    public function destroy(PersonalExpense $expense): JsonResponse
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }
        $this->expenseService->delete($expense);
        return response()->json(null, 204);
    }
}
