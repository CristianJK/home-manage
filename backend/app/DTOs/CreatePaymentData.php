<?php

declare(strict_types=1);

namespace App\DTOs;

final readonly class CreatePaymentData
{
    public function __construct(
        public float $amount,
        public string $paidAt,
        public ?int $sharedExpenseId = null,
        public ?string $notes = null,
        public ?string $photo = null,
    ) {}
}
