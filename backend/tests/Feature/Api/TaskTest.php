<?php

namespace Tests\Feature\Api;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskTest extends TestCase
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

    public function test_can_list_tasks(): void
    {
        Task::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/task');

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_list_returns_empty_when_no_tasks(): void
    {
        $response = $this->getJson('/api/task');

        $response->assertOk()
            ->assertJsonCount(0);
    }

    // ─── STORE ────────────────────────────────────────────────────────

    public function test_can_create_task(): void
    {
        $payload = [
            'title' => 'Clean kitchen',
            'description' => 'Deep clean the entire kitchen',
            'status' => 'pending',
            'user_id' => $this->user->id,
            'frequency' => 'weekly',
            'scheduled_at' => now()->addDays(3)->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['title' => 'Clean kitchen']);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Clean kitchen',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_store_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/task', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'status', 'user_id', 'frequency', 'scheduled_at']);
    }

    public function test_store_fails_with_invalid_user_id(): void
    {
        $payload = [
            'title' => 'Test Task',
            'description' => 'Test description',
            'status' => 'pending',
            'user_id' => 99999,
            'frequency' => 'daily',
            'scheduled_at' => now()->addDays(1)->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['user_id']);
    }

    public function test_store_fails_with_past_scheduled_at(): void
    {
        $payload = [
            'title' => 'Test Task',
            'description' => 'Test description',
            'status' => 'pending',
            'user_id' => $this->user->id,
            'frequency' => 'daily',
            'scheduled_at' => now()->subDays(5)->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['scheduled_at']);
    }

    // ─── SHOW ─────────────────────────────────────────────────────────

    public function test_can_show_task(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/task/{$task->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $task->id]);
    }

    public function test_show_returns_404_for_non_existent_task(): void
    {
        $response = $this->getJson('/api/task/99999');

        $response->assertStatus(404);
    }

    // ─── UPDATE ───────────────────────────────────────────────────────

    public function test_can_update_task(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'completed',
            'user_id' => $this->user->id,
            'frequency' => 'monthly',
            'scheduled_at' => now()->addDays(10)->toDateString(),
        ];

        $response = $this->patchJson("/api/task/{$task->id}", $payload);

        $response->assertOk()
            ->assertJsonFragment(['title' => 'Updated Task']);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task',
            'status' => 'completed',
        ]);
    }

    public function test_update_fails_without_required_fields(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->patchJson("/api/task/{$task->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'status', 'user_id', 'frequency', 'scheduled_at']);
    }

    public function test_update_returns_404_for_non_existent_task(): void
    {
        $payload = [
            'title' => 'Test',
            'description' => 'Test',
            'status' => 'pending',
            'user_id' => $this->user->id,
            'frequency' => 'daily',
            'scheduled_at' => now()->addDays(1)->toDateString(),
        ];

        $response = $this->patchJson('/api/task/99999', $payload);

        $response->assertStatus(404);
    }

    // ─── DESTROY ──────────────────────────────────────────────────────

    public function test_can_delete_task(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/task/{$task->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_delete_returns_404_for_non_existent_task(): void
    {
        $response = $this->deleteJson('/api/task/99999');

        $response->assertStatus(404);
    }
}
