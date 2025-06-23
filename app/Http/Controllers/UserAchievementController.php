<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\User;

class UserAchievementController extends Controller
{
    public function assign($userId, $achievementId)
    {
        $user = User::findOrFail($userId);
        // ensure the achievement exists
        $achievement = Achievement::findOrFail($achievementId);

        $user->achievements()->attach($achievement);

        return response()->json(['message' => 'Achievement assigned successfully.'], 201);
    }
}
