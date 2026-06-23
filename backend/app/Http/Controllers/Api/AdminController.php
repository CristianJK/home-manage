<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

final class AdminController extends Controller
{
    public function users()
    {
        return UserResource::collection(
            User::all(['id', 'name', 'email', 'salary', 'role', 'created_at'])
        );
    }

    public function updateRole(UpdateRoleRequest $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['role' => $request->validated('role')]);

        return response()->json(
            (new UserResource($user))->toArray($request)
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }
}
