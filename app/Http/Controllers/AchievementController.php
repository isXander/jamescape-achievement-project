<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
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
        $auth = $this->authenticateRequest($request, true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $this->validateRequest($request, true);

        $achievement = Achievement::create($request->all());

        return response()->json($achievement, 201);
    }

    public function delete($id)
    {
        $auth = $this->authenticateRequest(request(), true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $achievement = Achievement::findOrFail($id);
        $achievement->delete();

        return response()->json(['message' => 'Deleted successfully.'], 201);
    }

    public function update($id, Request $request)
    {
        $auth = $this->authenticateRequest($request, true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $this->validateRequest($request, false);

        $achievement = Achievement::findOrFail($id);
        $achievement->update($request->all());

        return response()->json($achievement);
    }

    function validateRequest(Request $request, bool $required): void
    {
        function requiredIf($condition, $field)
        {
            return $condition ? 'required|' . $field : $field;
        }
        $request->validate([
            'name' => requiredIf($required, "string|max:255"),
            'description' => requiredIf($required, 'string|max:1000'),
            'image_url' => requiredIf($required, 'url|max:500'),
        ]);
    }
}
