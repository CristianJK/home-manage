<?php

use App\Http\Controllers\Api\PersonalExpenseController;
use App\Http\Controllers\Api\SavingGoalController;
use App\Http\Controllers\Api\SharedExpenseController;
use App\Http\Controllers\Api\SharedExpensePercentageController;
use App\Http\Controllers\Api\SharedExpensePaymentController;
use App\Http\Controllers\Api\AdminController;
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
    Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::delete('/account', [AuthController::class, 'deleteAccount'])->middleware('auth:sanctum');
});

Route::prefix('personal-expense')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [PersonalExpenseController::class, 'index']);
    Route::post('/', [PersonalExpenseController::class, 'store']);
    Route::get('/{expense}', [PersonalExpenseController::class, 'show']);
    Route::patch('/{expense}', [PersonalExpenseController::class, 'update']);
    Route::delete('/{expense}', [PersonalExpenseController::class, 'destroy']);
});

Route::prefix('saving-goals')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [SavingGoalController::class, 'index']);
    Route::post('/', [SavingGoalController::class, 'store']);
    Route::get('/{saving_goal}', [SavingGoalController::class, 'show']);
    Route::patch('/{saving_goal}', [SavingGoalController::class, 'update']);
    Route::delete('/{saving_goal}', [SavingGoalController::class, 'destroy']);
});

Route::prefix('shared-expense')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [SharedExpenseController::class, 'index']);
    Route::get('/with-payments', [SharedExpenseController::class, 'withPayments']);
    Route::post('/', [SharedExpenseController::class, 'store']);
    Route::get('/{shared_expense}', [SharedExpenseController::class, 'show']);
    Route::patch('/{shared_expense}', [SharedExpenseController::class, 'update']);
    Route::delete('/{shared_expense}', [SharedExpenseController::class, 'destroy']);
});

Route::prefix('shared-finances/percentages')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [SharedExpensePercentageController::class, 'index']);
    Route::put('/', [SharedExpensePercentageController::class, 'update']);
});

Route::prefix('shared-finances/payments')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [SharedExpensePaymentController::class, 'index']);
    Route::post('/', [SharedExpensePaymentController::class, 'store']);
    Route::get('/{shared_expense_payment}', [SharedExpensePaymentController::class, 'show']);
    Route::patch('/{shared_expense_payment}', [SharedExpensePaymentController::class, 'update']);
    Route::delete('/{shared_expense_payment}', [SharedExpensePaymentController::class, 'destroy']);
});

Route::prefix('task')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/{task}', [TaskController::class, 'show']);
    Route::patch('/{task}', [TaskController::class, 'update']);
    Route::delete('/{task}', [TaskController::class, 'destroy']);
});

Route::prefix('admin')->middleware(['auth:sanctum', 'is-admin'])->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::patch('/users/{id}/role', [AdminController::class, 'updateRole']);
    Route::delete('/users/{id}', [AdminController::class, 'destroy']);
});
