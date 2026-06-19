<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $user->id,
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }

    public function test_profile_returns_user_with_salary(): void
    {
        $user = User::factory()->create(['salary' => 4500.50]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200);
        $response->assertJsonFragment(['salary' => '4500.50']);
    }

    public function test_unauthenticated_user_cannot_get_profile(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_profile_hides_sensitive_fields(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret'),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertJsonMissing(['password']);
        $response->assertJsonMissing(['google_id']);
    }
}
