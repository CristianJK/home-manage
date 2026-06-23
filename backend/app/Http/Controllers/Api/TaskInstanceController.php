<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskInstanceResource;
use App\Models\TaskInstance;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TaskInstanceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'status' => ['nullable', 'string', 'in:pending,completed,cancelled'],
        ]);

        $query = TaskInstance::with('task.user')
            ->whereHas('task', fn ($q) => $q->where('user_id', $request->user()->id))
            ->orderBy('scheduled_date', 'asc');

        if ($request->filled('from')) {
            $query->where('scheduled_date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('scheduled_date', '<=', $request->to);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return TaskInstanceResource::collection($query->get());
    }

    public function update(Request $request, TaskInstance $taskInstance): JsonResponse
    {
        if ($taskInstance->task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'status' => ['required', 'string', 'in:pending,completed,cancelled'],
        ]);

        $taskInstance->update(['status' => $request->status]);

        return response()->json(new TaskInstanceResource($taskInstance));
    }
}
