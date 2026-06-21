<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'shared_expense_id', 'amount', 'paid_at', 'notes'])]
class SharedExpensePayment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'paid_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sharedExpense(): BelongsTo
    {
        return $this->belongsTo(SharedExpense::class);
    }
}
