<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected function authenticateRequest(Request $request, bool $requires_admin): JsonResponse|User
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::where('api_token', $token)->first();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($requires_admin && !$user->is_admin) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $user; // No error, return the authenticated user
    }

    protected function authenticateSelfRequest(User $caller, User $target): JsonResponse|null
    {
        if (!$caller->is_admin && $caller->id !== $target->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return null; // No error, self-request is allowed
    }
}
