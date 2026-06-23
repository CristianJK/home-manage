<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\ExpenseCategory;

final readonly class CreatePersonalExpenseData
{
    public function __construct(
        public string $concept,
        public float $amount,
        public ExpenseCategory $category,
    ) {}
}
