<?php

declare(strict_types=1);

namespace App\Enums;

enum ExpenseFrequency: string
{
    case Unique = 'unique';
    case Monthly = 'monthly';
    case Yearly = 'yearly';
    case Biweekly = 'biweekly';
    case Semiannual = 'semiannual';

    public function label(): string
    {
        return match ($this) {
            self::Unique => 'Único',
            self::Monthly => 'Mensual',
            self::Yearly => 'Anual',
            self::Biweekly => 'Quincenal',
            self::Semiannual => 'Semestral',
        };
    }
}
