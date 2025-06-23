<?php

namespace Feature;

use App\Models\Achievement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAchievementTest extends TestCase
{
    use RefreshDatabase;

    public function test_assign_achievement_to_user(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'example@example.com',
            'password' => 'secret',
        ]);

        $achievement = Achievement::create([
            'name' => 'Test Achievement',
            'description' => 'This is a test achievement.',
            'image_url' => 'https://example.com/image.png',
        ]);

        $response = $this->postJson("/api/{$user->id}/assign/{$achievement->id}");
        $response->assertStatus(201)
                 ->assertJson(['message' => 'Achievement assigned successfully.']);

        $this->assertDatabaseHas('achievements_users', [
            'user_id' => $user->id,
            'achievement_id' => $achievement->id,
        ]);
    }
}
