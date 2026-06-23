<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SharedExpensePaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'shared_expense_id' => $this->shared_expense_id,
            'amount' => (float) $this->amount,
            'paid_at' => $this->paid_at,
            'notes' => $this->notes,
            'photo' => $this->photo,
            'user' => new UserResource($this->whenLoaded('user')),
            'shared_expense' => new SharedExpenseResource($this->whenLoaded('sharedExpense')),
        ];
    }
}
