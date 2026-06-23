<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SavingGoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'target_name' => $this->target_name,
            'category' => $this->category,
            'target_amount' => (float) $this->target_amount,
            'current_amount' => (float) ($this->current_amount ?? 0),
            'deadline' => $this->deadline,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
