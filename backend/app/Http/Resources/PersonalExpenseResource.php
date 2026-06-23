<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PersonalExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'concept' => $this->concept,
            'amount' => (float) $this->amount,
            'category' => $this->category,
            'created_at' => $this->created_at?->toIso8601String(),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
