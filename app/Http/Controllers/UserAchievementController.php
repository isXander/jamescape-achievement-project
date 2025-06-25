<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserAchievementController extends Controller
{
    public function assign($userId, $achievementId)
    {
        $auth = $this->authenticateRequest(request(), true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $user = User::findOrFail($userId);
        // ensure the achievement exists
        $achievement = Achievement::findOrFail($achievementId);

        $user->achievements()->attach($achievement);

        return response()->json(['message' => 'Achievement assigned successfully.'], 201);
    }

    public function getUserAchievements($userId)
    {
        $auth = $this->authenticateRequest(request(), false);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }
        /** @var User $caller */
        $caller = $auth;

        $user = User::findOrFail($userId);

        $auth = $this->authenticateSelfRequest($caller, $user);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if self-request validation fails
        }

        $achievements = $user->achievements()->get();

        return response()->json($achievements);
    }
}
