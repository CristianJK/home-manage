<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'google_id', 'salary', 'avatar', 'role'])]
#[Hidden(['password', 'remember_token', 'google_id'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'salary' => 'decimal:2',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function personalExpense(): HasMany
    {
        return $this->hasMany(PersonalExpense::class);
    }

    public function savingGoals(): HasMany
    {
        return $this->hasMany(SavingGoal::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
