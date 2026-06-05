<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['concept', 'amount', 'frequency', 'due_date', 'is_paid', 'comment', 'user_id'])]
class SharedExpense extends Model
{
    use HasFactory;
}
