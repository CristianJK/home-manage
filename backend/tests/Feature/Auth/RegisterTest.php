<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'salary' => 5000.00,
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email'],
            ])
            ->assertJson(['token_type' => 'Bearer']);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
    }

    public function test_register_without_salary_defaults_to_zero(): void
    {
        $payload = [
            'name' => 'No Salary User',
            'email' => 'nosalary@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'nosalary@example.com',
            'salary' => '0.00',
        ]);
    }

    public function test_register_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/auth/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_register_fails_with_invalid_email(): void
    {
        $payload = [
            'name' => 'Test',
            'email' => 'not-an-email',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'duplicate@example.com']);

        $payload = [
            'name' => 'Duplicate',
            'email' => 'duplicate@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_fails_when_passwords_do_not_match(): void
    {
        $payload = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'DifferentPassword!',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }
}
