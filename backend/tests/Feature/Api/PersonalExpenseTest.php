<?php

namespace Tests\Feature\Api;

use App\Models\PersonalExpense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PersonalExpenseTest extends TestCase
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

    public function test_can_list_personal_expenses(): void
    {
        PersonalExpense::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/personal-expense');

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_list_returns_empty_when_no_expenses(): void
    {
        $response = $this->getJson('/api/personal-expense');

        $response->assertOk()
            ->assertJsonCount(0);
    }

    // ─── STORE ────────────────────────────────────────────────────────

    public function test_can_create_personal_expense(): void
    {
        $payload = [
            'concept' => 'Groceries',
            'amount' => 150.50,
            'category' => 'food',
        ];

        $response = $this->postJson('/api/personal-expense', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['concept' => 'Groceries', 'category' => 'food']);

        $this->assertDatabaseHas('personal_expenses', [
            'concept' => 'Groceries',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_store_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/personal-expense', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['concept', 'amount', 'category']);
    }

    public function test_store_fails_with_negative_amount(): void
    {
        $payload = [
            'concept' => 'Test',
            'amount' => -10,
            'category' => 'food',
        ];

        $response = $this->postJson('/api/personal-expense', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    // ─── SHOW ─────────────────────────────────────────────────────────

    public function test_can_show_personal_expense(): void
    {
        $expense = PersonalExpense::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/personal-expense/{$expense->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $expense->id]);
    }

    public function test_show_returns_404_for_non_existent_expense(): void
    {
        $response = $this->getJson('/api/personal-expense/99999');

        $response->assertStatus(404);
    }

    // ─── UPDATE ───────────────────────────────────────────────────────

    public function test_can_update_personal_expense(): void
    {
        $expense = PersonalExpense::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'concept' => 'Updated Concept',
            'amount' => 200.00,
            'category' => 'transportation',
        ];

        $response = $this->patchJson("/api/personal-expense/{$expense->id}", $payload);

        $response->assertOk()
            ->assertJsonFragment(['concept' => 'Updated Concept']);

        $this->assertDatabaseHas('personal_expenses', [
            'id' => $expense->id,
            'concept' => 'Updated Concept',
        ]);
    }

    public function test_update_fails_without_required_fields(): void
    {
        $expense = PersonalExpense::factory()->create(['user_id' => $this->user->id]);

        $response = $this->patchJson("/api/personal-expense/{$expense->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['concept', 'amount', 'category']);
    }

    public function test_update_returns_404_for_non_existent_expense(): void
    {
        $payload = [
            'concept' => 'Test',
            'amount' => 100,
            'category' => 'food',
        ];

        $response = $this->patchJson('/api/personal-expense/99999', $payload);

        $response->assertStatus(404);
    }

    // ─── DESTROY ──────────────────────────────────────────────────────

    public function test_can_delete_personal_expense(): void
    {
        $expense = PersonalExpense::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/personal-expense/{$expense->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('personal_expenses', ['id' => $expense->id]);
    }

    public function test_delete_returns_404_for_non_existent_expense(): void
    {
        $response = $this->deleteJson('/api/personal-expense/99999');

        $response->assertStatus(404);
    }
}
