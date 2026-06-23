<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class TaskInstanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            'scheduled_date' => $this->scheduled_date,
            'status' => $this->status,
            'task' => new TaskResource($this->whenLoaded('task')),
        ];
    }
}
