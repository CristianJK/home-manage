<?php

declare(strict_types=1);

namespace App\DTOs;

final readonly class CreateSavingGoalData
{
    public function __construct(
        public string $targetName,
        public ?string $category = null,
        public float $targetAmount = 0.0,
        public string $deadline = '',
        public ?float $currentAmount = null,
    ) {}
}
