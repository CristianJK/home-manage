<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'shared_expense_id', 'amount', 'paid_at', 'notes', 'photo'])]
class SharedExpensePayment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'paid_at' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (SharedExpensePayment $payment) {
            $payment->syncExpenseStatus();
        });

        static::deleted(function (SharedExpensePayment $payment) {
            $payment->syncExpenseStatus();
        });
    }

    public function syncExpenseStatus(): void
    {
        $expense = $this->sharedExpense;
        if (!$expense) return;

        $totalPaid = $expense->payments()->sum('amount');
        $expense->is_paid = $totalPaid >= $expense->amount;
        $expense->saveQuietly();
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
