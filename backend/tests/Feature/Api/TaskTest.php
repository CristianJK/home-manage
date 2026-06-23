<?php

namespace Tests\Feature\Api;

use App\Models\Task;
use App\Models\TaskInstance;
use App\Models\User;
use App\Services\TaskService;
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
            ->assertJsonValidationErrors(['title', 'status']);
    }

    public function test_store_defaults_user_id_from_auth(): void
    {
        $payload = [
            'title' => 'Test Task',
            'status' => 'pending',
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_store_fails_with_past_scheduled_at(): void
    {
        $payload = [
            'title' => 'Test Task',
            'description' => 'Test description',
            'status' => 'pending',
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

    public function test_update_partial_fields_only(): void
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Original Title',
            'status' => 'pending',
        ]);

        $response = $this->patchJson("/api/task/{$task->id}", [
            'title' => 'Only Title Changed',
        ]);

        $response->assertOk()
            ->assertJsonFragment(['title' => 'Only Title Changed']);
    }

    public function test_update_returns_404_for_non_existent_task(): void
    {
        $payload = [
            'title' => 'Test',
            'status' => 'pending',
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

    private function createRecurringTaskViaApi(string $frequency = 'daily', ?string $scheduledAt = null): Task
    {
        $payload = [
            'title' => 'Recurring task',
            'status' => 'pending',
            'frequency' => $frequency,
            'scheduled_at' => $scheduledAt ?? now()->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);
        return Task::find($response->json('id'));
    }

    private function makeRecurringTask(string $frequency = 'daily'): Task
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'frequency' => $frequency,
            'scheduled_at' => now()->toDateString(),
        ]);

        app(TaskService::class)->generateInstances($task);

        return $task;
    }

    // ─── INSTANCE GENERATION ──────────────────────────────────────────

    public function test_create_task_with_frequency_generates_instances(): void
    {
        $payload = [
            'title' => 'Clean kitchen',
            'status' => 'pending',
            'frequency' => 'daily',
            'scheduled_at' => now()->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(201);
        $taskId = $response->json('id');

        $this->assertDatabaseHas('task_instances', [
            'task_id' => $taskId,
            'status' => 'pending',
        ]);

        $instances = TaskInstance::where('task_id', $taskId)->get();
        $this->assertCount(6, $instances);
    }

    public function test_create_task_without_frequency_creates_single_instance(): void
    {
        $payload = [
            'title' => 'One time task',
            'status' => 'pending',
            'scheduled_at' => now()->addDays(3)->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(201);
        $taskId = $response->json('id');

        $instances = TaskInstance::where('task_id', $taskId)->get();
        $this->assertCount(1, $instances);
        $this->assertEquals(now()->addDays(3)->toDateString(), $instances->first()->scheduled_date->toDateString());
    }

    public function test_recurring_task_generates_max_six_instances(): void
    {
        $payload = [
            'title' => 'Weekly task',
            'status' => 'pending',
            'frequency' => 'weekly',
            'scheduled_at' => now()->toDateString(),
        ];

        $response = $this->postJson('/api/task', $payload);

        $response->assertStatus(201);
        $taskId = $response->json('id');

        $instances = TaskInstance::where('task_id', $taskId)->get();
        $this->assertCount(6, $instances);

        $dates = $instances->pluck('scheduled_date')->map(fn ($d) => $d->toDateString())->toArray();
        $expected = [];
        $current = now()->startOfDay();
        for ($i = 0; $i < 6; $i++) {
            $expected[] = $current->format('Y-m-d');
            $current->addWeek();
        }
        $this->assertEquals($expected, $dates);
    }

    public function test_update_frequency_regenerates_instances(): void
    {
        $task = $this->makeRecurringTask('daily');

        $this->assertCount(6, $task->instances);

        $response = $this->patchJson("/api/task/{$task->id}", [
            'frequency' => 'weekly',
        ]);

        $response->assertOk();

        $task->refresh();
        $this->assertCount(6, $task->instances()->where('status', 'pending')->get());

        $dates = $task->instances->pluck('scheduled_date')->map(fn ($d) => $d instanceof \Carbon\Carbon ? $d->format('Y-m-d') : $d)->toArray();
        $expected = [];
        $current = now()->startOfDay();
        for ($i = 0; $i < 6; $i++) {
            $expected[] = $current->format('Y-m-d');
            $current->addWeek();
        }
        $this->assertEquals($expected, $dates);
    }

    public function test_remove_frequency_deletes_instances(): void
    {
        $task = $this->makeRecurringTask('daily');

        $this->assertCount(6, $task->instances);

        $response = $this->patchJson("/api/task/{$task->id}", [
            'frequency' => null,
        ]);

        $response->assertOk();

        $task->refresh();
        $this->assertCount(0, $task->instances()->where('status', 'pending')->get());
    }

    // ─── TASK INSTANCE CONTROLLER ─────────────────────────────────────

    public function test_can_list_task_instances_by_date_range(): void
    {
        $this->makeRecurringTask('daily');

        $from = now()->toDateString();
        $to = now()->addDays(2)->toDateString();

        $response = $this->getJson("/api/task-instances?from={$from}&to={$to}");

        $response->assertOk();
        $this->assertCount(3, $response->json());
    }

    public function test_can_complete_task_instance(): void
    {
        $task = $this->makeRecurringTask('daily');

        $instance = $task->instances()->first();

        $response = $this->patchJson("/api/task-instances/{$instance->id}", [
            'status' => 'completed',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('task_instances', [
            'id' => $instance->id,
            'status' => 'completed',
        ]);
    }

    public function test_cannot_update_instance_of_other_user(): void
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $otherUser->id,
            'frequency' => 'daily',
            'scheduled_at' => now()->toDateString(),
        ]);
        app(TaskService::class)->generateInstances($task);

        $instance = $task->instances()->first();

        Sanctum::actingAs($this->user);

        $response = $this->patchJson("/api/task-instances/{$instance->id}", [
            'status' => 'completed',
        ]);

        $response->assertStatus(403);
    }
}
