<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_redirect_returns_google_url(): void
    {
        $mockRedirect = Mockery::mock();
        $mockRedirect->shouldReceive('getTargetUrl')
            ->once()
            ->andReturn('https://accounts.google.com/o/oauth2/auth?client_id=test');

        $mockDriver = Mockery::mock();
        $mockDriver->shouldReceive('stateless')->once()->andReturnSelf();
        $mockDriver->shouldReceive('redirect')->once()->andReturn($mockRedirect);

        Socialite::shouldReceive('driver')->with('google')->once()->andReturn($mockDriver);

        $response = $this->getJson('/api/auth/google');

        $response->assertStatus(200);
        $response->assertJsonStructure(['url']);
        $response->assertJsonFragment(['url' => 'https://accounts.google.com/o/oauth2/auth?client_id=test']);
    }

    public function test_callback_creates_user_and_returns_token(): void
    {
        $abstractUser = new SocialiteUser();
        $abstractUser->id = 'google-id-123';
        $abstractUser->name = 'Google User';
        $abstractUser->email = 'google@example.com';
        $abstractUser->avatar = 'https://example.com/avatar.jpg';

        $mockDriver = Mockery::mock();
        $mockDriver->shouldReceive('stateless')->once()->andReturnSelf();
        $mockDriver->shouldReceive('user')->once()->andReturn($abstractUser);

        Socialite::shouldReceive('driver')->with('google')->once()->andReturn($mockDriver);

        $response = $this->getJson('/api/auth/google/callback');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'access_token',
            'token_type',
            'user' => ['id', 'name', 'email'],
        ]);
        $response->assertJsonFragment([
            'token_type' => 'Bearer',
            'name' => 'Google User',
            'email' => 'google@example.com',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'google@example.com',
            'name' => 'Google User',
            'google_id' => 'google-id-123',
            'avatar' => 'https://example.com/avatar.jpg',
        ]);
    }

    public function test_callback_updates_existing_user(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
            'google_id' => null,
            'name' => 'Old Name',
        ]);

        $abstractUser = new SocialiteUser();
        $abstractUser->id = 'google-id-456';
        $abstractUser->name = 'New Name';
        $abstractUser->email = 'existing@example.com';
        $abstractUser->avatar = 'https://example.com/new-avatar.jpg';

        $mockDriver = Mockery::mock();
        $mockDriver->shouldReceive('stateless')->once()->andReturnSelf();
        $mockDriver->shouldReceive('user')->once()->andReturn($abstractUser);

        Socialite::shouldReceive('driver')->with('google')->once()->andReturn($mockDriver);

        $response = $this->getJson('/api/auth/google/callback');

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'email' => 'existing@example.com',
            'name' => 'New Name',
            'google_id' => 'google-id-456',
        ]);

        $this->assertDatabaseMissing('users', [
            'email' => 'existing@example.com',
            'name' => 'Old Name',
        ]);
    }

    public function test_callback_returns_error_on_exception(): void
    {
        $mockDriver = Mockery::mock();
        $mockDriver->shouldReceive('stateless')->once()->andReturnSelf();
        $mockDriver->shouldReceive('user')->once()->andThrow(new \Exception('Google API error'));

        Socialite::shouldReceive('driver')->with('google')->once()->andReturn($mockDriver);

        $response = $this->getJson('/api/auth/google/callback');

        $response->assertStatus(401);
        $response->assertJsonFragment(['error' => 'Fallo en la autenticación con Google']);
    }
}
