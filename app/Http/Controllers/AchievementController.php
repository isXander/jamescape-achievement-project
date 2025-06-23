<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Achievement;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = Achievement::all();

        return response()->json($achievements);
    }

    public function show($id)
    {
        $achievement = Achievement::findOrFail($id);

        return response()->json($achievement);
    }

    public function store(Request $request)
    {
        $this->validateRequest($request);

        $achievement = Achievement::create($request->all());

        return response()->json($achievement, 201);
    }

    public function delete($id)
    {
        $achievement = Achievement::findOrFail($id);
        $achievement->delete();

        return response()->json(['message' => 'Deleted successfully.'], 201);
    }

    public function update($id, Request $request)
    {
        $this->validateRequest($request);

        $achievement = Achievement::findOrFail($id);
        $achievement->update($request->all());

        return response()->json($achievement);
    }

    function validateRequest(Request $request): void
    {
        $request->validate([
            'name' => "required|string|max:255",
            'description' => 'required|string|max:1000',
            'image_url' => 'required|url|max:500',
        ]);
    }
}
