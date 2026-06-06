<?php

namespace Tests\Feature\Api;

use App\Models\SavingGoal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SavingGoalTest extends TestCase
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

    public function test_can_list_saving_goals(): void
    {
        SavingGoal::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/saving-goals');

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_list_returns_empty_when_no_goals(): void
    {
        $response = $this->getJson('/api/saving-goals');

        $response->assertOk()
            ->assertJsonCount(0);
    }

    // ─── STORE ────────────────────────────────────────────────────────

    public function test_can_create_saving_goal(): void
    {
        $payload = [
            'target_name' => 'Vacation Fund',
            'target_amount' => 10000.00,
            'deadline' => now()->addMonths(6)->toDateString(),
            'current_amount' => 500.00,
        ];

        $response = $this->postJson('/api/saving-goals', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['target_name' => 'Vacation Fund']);

        $this->assertDatabaseHas('saving_goals', [
            'target_name' => 'Vacation Fund',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_create_saving_goal_without_current_amount(): void
    {
        $payload = [
            'target_name' => 'New Car',
            'target_amount' => 25000.00,
            'deadline' => now()->addYear()->toDateString(),
        ];

        $response = $this->postJson('/api/saving-goals', $payload);

        $response->assertStatus(201);
    }

    public function test_store_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/saving-goals', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['target_name', 'target_amount', 'deadline']);
    }

    public function test_store_fails_with_invalid_deadline(): void
    {
        $payload = [
            'target_name' => 'Test',
            'target_amount' => 1000,
            'deadline' => 'not-a-date',
        ];

        $response = $this->postJson('/api/saving-goals', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['deadline']);
    }

    // ─── SHOW ─────────────────────────────────────────────────────────

    public function test_can_show_saving_goal(): void
    {
        $goal = SavingGoal::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/saving-goals/{$goal->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $goal->id]);
    }

    public function test_show_returns_null_for_non_existent_goal(): void
    {
        $response = $this->getJson('/api/saving-goals/99999');

        // SavingGoalController::show uses find() not findOrFail(), so it returns null
        // In Laravel 13, response()->json(null) serializes to {} instead of null
        $response->assertOk();
        $this->assertSame('{}', $response->getContent());
    }

    // ─── UPDATE ───────────────────────────────────────────────────────

    public function test_can_update_saving_goal(): void
    {
        $goal = SavingGoal::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'target_name' => 'Updated Goal',
            'target_amount' => 20000.00,
            'deadline' => now()->addMonths(3)->toDateString(),
            'current_amount' => 1000.00,
        ];

        $response = $this->patchJson("/api/saving-goals/{$goal->id}", $payload);

        $response->assertOk()
            ->assertJsonFragment(['target_name' => 'Updated Goal']);

        $this->assertDatabaseHas('saving_goals', [
            'id' => $goal->id,
            'target_name' => 'Updated Goal',
        ]);
    }

    public function test_update_fails_without_required_fields(): void
    {
        $goal = SavingGoal::factory()->create(['user_id' => $this->user->id]);

        $response = $this->patchJson("/api/saving-goals/{$goal->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['target_name', 'target_amount', 'deadline']);
    }

    public function test_update_returns_404_for_non_existent_goal(): void
    {
        $payload = [
            'target_name' => 'Test',
            'target_amount' => 1000,
            'deadline' => now()->addMonth()->toDateString(),
        ];

        $response = $this->patchJson('/api/saving-goals/99999', $payload);

        $response->assertStatus(404);
    }

    // ─── DESTROY ──────────────────────────────────────────────────────

    public function test_can_delete_saving_goal(): void
    {
        $goal = SavingGoal::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/saving-goals/{$goal->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('saving_goals', ['id' => $goal->id]);
    }

    public function test_delete_returns_404_for_non_existent_goal(): void
    {
        $response = $this->deleteJson('/api/saving-goals/99999');

        $response->assertStatus(404);
    }
}
