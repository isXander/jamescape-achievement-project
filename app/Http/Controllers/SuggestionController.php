<?php

namespace App\Http\Controllers;

use App\Models\AchievementSuggestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function index() {
        $auth = $this->authenticateRequest(request(), true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $suggestions = AchievementSuggestion::all();

        return response()->json($suggestions, 200);
    }

    public function store(Request $request) {
        $request->validate([
            'suggestion' => 'required|string|max:1000',
        ]);

        $suggestion = AchievementSuggestion::create($request->all());

        return response()->json($suggestion, 201);
    }

    public function show($id) {
        $auth = $this->authenticateRequest(request(), true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $suggestion = AchievementSuggestion::findOrFail($id);

        return response()->json($suggestion, 200);
    }
}
