<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function users()
    {
        return response()->json(User::all(['id', 'name', 'email', 'salary', 'role', 'created_at']));
    }

    public function updateRole(Request $request, string $id)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['user', 'admin'])],
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return response()->json($user->only(['id', 'name', 'email', 'role']));
    }
}
