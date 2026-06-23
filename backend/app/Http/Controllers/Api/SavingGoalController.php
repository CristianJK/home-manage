<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSavingGoalRequest;
use App\Http\Requests\UpdateSavingGoalRequest;
use App\Http\Resources\SavingGoalResource;
use App\Models\SavingGoal;
use App\Services\SavingGoalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class SavingGoalController extends Controller
{
    public function __construct(
        private readonly SavingGoalService $savingGoalService,
    ) {}

    public function index(Request $request)
    {
        return SavingGoalResource::collection(
            $request->user()->savingGoals()->latest()->get()
        );
    }

    public function store(StoreSavingGoalRequest $request): JsonResponse
    {
        $goal = $this->savingGoalService->create(
            $request->user(),
            $request->toDto(),
        );

        return (new SavingGoalResource($goal))
            ->response()
            ->setStatusCode(201);
    }

    public function show(SavingGoal $savingGoal): SavingGoalResource
    {
        return new SavingGoalResource($savingGoal);
    }

    public function update(UpdateSavingGoalRequest $request, SavingGoal $savingGoal): SavingGoalResource
    {
        $goal = $this->savingGoalService->update($savingGoal, $request->toDto());
        return new SavingGoalResource($goal);
    }

    public function destroy(SavingGoal $savingGoal): JsonResponse
    {
        $this->savingGoalService->delete($savingGoal);
        return response()->json($savingGoal);
    }
}
