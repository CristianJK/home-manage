<?php

namespace Tests\Feature\Api;

use App\Models\SharedExpense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SharedExpenseTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    // ─── INDEX ────────────────────────────────────────────────────────

    public function test_can_list_shared_expenses(): void
    {
        SharedExpense::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/shared-expense');

        $response->assertOk();
    }

    public function test_list_returns_empty_when_no_shared_expenses(): void
    {
        $response = $this->getJson('/api/shared-expense');

        $response->assertOk();
    }

    // ─── STORE ────────────────────────────────────────────────────────

    public function test_can_create_shared_expense(): void
    {
        $payload = [
            'concept' => 'Electricity Bill',
            'amount' => 250.00,
            'frequency' => 'monthly',
            'due_date' => now()->addDays(15)->toDateString(),
            'is_paid' => false,
            'comment' => 'Split between roommates',
        ];

        $response = $this->postJson('/api/shared-expense', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['concept' => 'Electricity Bill']);

        $this->assertDatabaseHas('shared_expenses', [
            'concept' => 'Electricity Bill',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_store_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/shared-expense', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['concept', 'amount', 'frequency', 'due_date']);
    }

    public function test_store_fails_with_negative_amount(): void
    {
        $payload = [
            'concept' => 'Test',
            'amount' => -100,
            'frequency' => 'monthly',
            'due_date' => now()->addDays(5)->toDateString(),
            'is_paid' => false,
            'comment' => 'test',
        ];

        $response = $this->postJson('/api/shared-expense', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_store_fails_with_past_due_date(): void
    {
        $payload = [
            'concept' => 'Test',
            'amount' => 100,
            'frequency' => 'monthly',
            'due_date' => now()->subDays(5)->toDateString(),
            'is_paid' => false,
            'comment' => 'test',
        ];

        $response = $this->postJson('/api/shared-expense', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['due_date']);
    }

    // ─── SHOW ─────────────────────────────────────────────────────────

    public function test_can_show_shared_expense(): void
    {
        $expense = SharedExpense::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/shared-expense/{$expense->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $expense->id]);
    }

    public function test_show_returns_404_for_non_existent_expense(): void
    {
        $response = $this->getJson('/api/shared-expense/99999');

        $response->assertStatus(404);
    }

    // ─── UPDATE ───────────────────────────────────────────────────────

    public function test_can_update_shared_expense(): void
    {
        $expense = SharedExpense::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'concept' => 'Updated Rent',
            'amount' => 500.00,
            'frequency' => 'monthly',
            'due_date' => now()->addDays(10)->toDateString(),
            'is_paid' => true,
            'comment' => 'Paid this month',
        ];

        $response = $this->patchJson("/api/shared-expense/{$expense->id}", $payload);

        $response->assertOk()
            ->assertJsonFragment(['concept' => 'Updated Rent']);

        $this->assertDatabaseHas('shared_expenses', [
            'id' => $expense->id,
            'concept' => 'Updated Rent',
        ]);
    }

    public function test_update_fails_without_required_fields(): void
    {
        $expense = SharedExpense::factory()->create(['user_id' => $this->user->id]);

        $response = $this->patchJson("/api/shared-expense/{$expense->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['concept', 'amount', 'frequency', 'due_date']);
    }

    public function test_update_returns_404_for_non_existent_expense(): void
    {
        $payload = [
            'concept' => 'Test',
            'amount' => 100,
            'frequency' => 'monthly',
            'due_date' => now()->addDays(5)->toDateString(),
            'is_paid' => false,
            'comment' => 'test',
        ];

        $response = $this->patchJson('/api/shared-expense/99999', $payload);

        $response->assertStatus(404);
    }

    // ─── DESTROY ──────────────────────────────────────────────────────

    public function test_can_delete_shared_expense(): void
    {
        $expense = SharedExpense::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/shared-expense/{$expense->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('shared_expenses', ['id' => $expense->id]);
    }

    public function test_delete_returns_404_for_non_existent_expense(): void
    {
        $response = $this->deleteJson('/api/shared-expense/99999');

        $response->assertStatus(404);
    }
}
