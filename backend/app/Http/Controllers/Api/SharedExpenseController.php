<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSharedExpenseRequest;
use App\Http\Requests\UpdateSharedExpenseRequest;
use App\Http\Resources\SharedExpenseResource;
use App\Models\SharedExpense;
use App\Services\SharedExpenseService;
use Illuminate\Http\JsonResponse;

final class SharedExpenseController extends Controller
{
    public function __construct(
        private readonly SharedExpenseService $expenseService,
    ) {}

    public function index()
    {
        return SharedExpenseResource::collection(
            SharedExpense::with('payments')->latest('due_date')->get()
        );
    }

    public function withPayments()
    {
        return SharedExpenseResource::collection(
            SharedExpense::with('payments.user')->latest('due_date')->get()
        );
    }

    public function store(StoreSharedExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->create(
            $request->user(),
            $request->toDto(),
        );

        return (new SharedExpenseResource($expense))
            ->response()
            ->setStatusCode(201);
    }

    public function show(SharedExpense $sharedExpense): SharedExpenseResource
    {
        $sharedExpense->load('payments.user');
        return new SharedExpenseResource($sharedExpense);
    }

    public function update(UpdateSharedExpenseRequest $request, SharedExpense $sharedExpense): SharedExpenseResource
    {
        $sharedExpense->update($request->validated());
        return new SharedExpenseResource($sharedExpense);
    }

    public function destroy(SharedExpense $sharedExpense): JsonResponse
    {
        $this->expenseService->delete($sharedExpense);
        return response()->json($sharedExpense);
    }
}
