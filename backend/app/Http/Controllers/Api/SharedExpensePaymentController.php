<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Http\Resources\SharedExpensePaymentResource;
use App\Models\SharedExpensePayment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class SharedExpensePaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService,
    ) {}

    public function index(Request $request)
    {
        $query = SharedExpensePayment::with(['user', 'sharedExpense'])
            ->where('user_id', auth()->id());

        if ($request->query('month')) {
            $month = date('Y-m', strtotime((string) $request->query('month')));
            $query->where('paid_at', 'like', "$month%");
        }

        return SharedExpensePaymentResource::collection(
            $query->latest('paid_at')->get()
        );
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->create(
            $request->user(),
            $request->toDto(),
        );

        return (new SharedExpensePaymentResource($payment))
            ->response()
            ->setStatusCode(201);
    }

    public function show(SharedExpensePayment $sharedExpensePayment): SharedExpensePaymentResource
    {
        $sharedExpensePayment->load(['user', 'sharedExpense']);
        return new SharedExpensePaymentResource($sharedExpensePayment);
    }

    public function update(UpdatePaymentRequest $request, SharedExpensePayment $sharedExpensePayment): SharedExpensePaymentResource
    {
        $sharedExpensePayment->update($request->validated());
        $sharedExpensePayment->load(['user', 'sharedExpense']);
        return new SharedExpensePaymentResource($sharedExpensePayment);
    }

    public function destroy(SharedExpensePayment $sharedExpensePayment): JsonResponse
    {
        $this->paymentService->delete($sharedExpensePayment);
        return response()->json($sharedExpensePayment);
    }
}
