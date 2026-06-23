<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SharedExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'concept' => $this->concept,
            'amount' => (float) $this->amount,
            'frequency' => $this->frequency,
            'due_date' => $this->due_date,
            'is_paid' => (bool) $this->is_paid,
            'comment' => $this->comment,
            'user_id' => $this->user_id,
            'payments' => SharedExpensePaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
