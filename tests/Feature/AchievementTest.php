<?php

namespace Feature;

use App\Models\Achievement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AchievementTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     */
    public function test_index_returns_all_achievements(): void
    {
        $achievement_data = [
            'name' => 'Test Achievement',
            'description' => 'This is a test achievement.',
            'image_url' => 'https://example.com/image.png',
        ];

        $post_response = $this->postJson('/api/achievement', $achievement_data);
        $post_response->assertStatus(201);

        $index_response = $this->getJson('/api/achievement');
        $index_response->assertStatus(200)
                       ->assertJsonFragment($achievement_data);
    }

    public function test_delete(): void
    {
        $this->test_index_returns_all_achievements();
        $achievement = Achievement::first();
        $delete_response = $this->deleteJson("/api/achievement/{$achievement->id}");
        $delete_response->assertStatus(201);

        $index_response = $this->getJson('/api/achievement');
        $index_response->assertStatus(200)
                       ->assertJsonMissing(['id' => $achievement->id]);
    }

    public function test_update(): void
    {
        $this->test_index_returns_all_achievements();

        $achievement = Achievement::first();
        $update_data = [
            'name' => 'Updated Achievement',
            'description' => 'This is an updated test achievement.',
            'image_url' => 'https://example.com/updated_image.png',
        ];

        $update_response = $this->putJson("/api/achievement/{$achievement->id}", $update_data);
        $update_response->assertStatus(200)
                        ->assertJsonFragment($update_data);

        $index_response = $this->getJson('/api/achievement');
        $index_response->assertStatus(200)
                       ->assertJsonFragment($update_data)
                       ->assertJsonMissing(['name' => 'Test Achievement']);
    }

    public function test_validate_missing_fields_request(): void
    {
        $invalid_data = [
            // missing 'name'
            // missing 'description'
            // missing 'image_url'
        ];

        $response = $this->postJson('/api/achievement', $invalid_data);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'description', 'image_url']);
    }

    public function test_validate_invalid_image_url_request(): void
    {
        $invalid_data = [
            'name' => 'Test Achievement',
            'description' => 'This is a test achievement.',
            'image_url' => 'invalid-url', // Invalid URL
        ];

        $response = $this->postJson('/api/achievement', $invalid_data);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image_url']);
    }
}
