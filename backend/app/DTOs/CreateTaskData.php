<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\TaskStatus;

final readonly class CreateTaskData
{
    public function __construct(
        public string $title,
        public ?string $description = null,
        public TaskStatus $status = TaskStatus::Pending,
        public ?string $frequency = null,
        public ?string $scheduledAt = null,
    ) {}
}
