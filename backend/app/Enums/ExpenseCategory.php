<?php

declare(strict_types=1);

namespace App\Enums;

enum ExpenseCategory: string
{
    case Food = 'food';
    case Housing = 'housing';
    case Transport = 'transport';
    case Health = 'health';
    case Entertainment = 'entertainment';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Food => 'Comida',
            self::Housing => 'Vivienda',
            self::Transport => 'Transporte',
            self::Health => 'Salud',
            self::Entertainment => 'Entretenimiento',
            self::Other => 'Otro',
        };
    }
}
