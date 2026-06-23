<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\ExpenseFrequency;

final readonly class CreateSharedExpenseData
{
    public function __construct(
        public string $concept,
        public float $amount,
        public ExpenseFrequency $frequency,
        public string $dueDate,
        public ?string $comment = null,
        public bool $isPaid = false,
    ) {}
}
