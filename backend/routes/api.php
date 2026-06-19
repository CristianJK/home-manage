<?php

use App\Http\Controllers\Api\PersonalExpenseController;
use App\Http\Controllers\Api\SavingGoalController;
use App\Http\Controllers\Api\SharedExpenseController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('auth')->group(function () {
    Route::get('/google', [GoogleController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback']);

    // Local Auth Routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/saving-goals', [SavingGoalController::class, 'index']);
    Route::post('/saving-goals', [SavingGoalController::class, 'store']);
    Route::patch('/saving-goals/{id}', [SavingGoalController::class, 'updateProgress']);
    Route::delete('/saving-goals/{id}', [SavingGoalController::class, 'destroy']);
});

Route::prefix('personal-expense')->group(function () {
    Route::get('/', [PersonalExpenseController::class, 'index']);
    Route::post('/', [PersonalExpenseController::class, 'store']);
    Route::get('/{id}', [PersonalExpenseController::class, 'show']);
    Route::patch('/{id}', [PersonalExpenseController::class, 'update']);
    Route::delete('/{id}', [PersonalExpenseController::class, 'destroy']);
});

Route::prefix('saving-goals')->group(function () {
    Route::get('/', [SavingGoalController::class, 'index']);
    Route::post('/', [SavingGoalController::class, 'store']);
    Route::get('/{id}', [SavingGoalController::class, 'show']);
    Route::patch('/{id}', [SavingGoalController::class, 'update']);
    Route::delete('/{id}', [SavingGoalController::class, 'destroy']);
});

Route::prefix('shared-expense')->group(function () {
    Route::get('/', [SharedExpenseController::class, 'index']);
    Route::post('/', [SharedExpenseController::class, 'store']);
    Route::get('/{id}', [SharedExpenseController::class, 'show']);
    Route::patch('/{id}', [SharedExpenseController::class, 'update']);
    Route::delete('/{id}', [SharedExpenseController::class, 'destroy']);
});

Route::prefix('task')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/{id}', [TaskController::class, 'show']);
    Route::patch('/{id}', [TaskController::class, 'update']);
    Route::delete('/{id}', [TaskController::class, 'destroy']);
});
