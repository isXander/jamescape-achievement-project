<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $auth = $this->authenticateRequest(request(), true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $users = User::all();

        return response()->json($users, 200);
    }

    public function show($id)
    {
        $auth = $this->authenticateRequest(request(), false);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }
        /** @var User $caller */
        $caller = $auth; // The authenticated user

        $user = User::findOrFail($id);

        $auth = $this->authenticateSelfRequest($caller, $user);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if self-request validation fails
        }

        return response()->json($user, 200);
    }

    public function store(Request $request)
    {
        $auth = $this->authenticateRequest($request, true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $this->validateRequest($request);

        $user = User::create($request->all());

        return response()->json($user, 201);
    }

    public function delete($id)
    {
        $auth = $this->authenticateRequest(request(), true);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Deleted sucessfully.'], 201);
    }
    public function update($id, Request $request)
    {
        $auth = $this->authenticateRequest(request(), false);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }
        /** @var User $caller */
        $caller = $auth; // The authenticated user

        $this->validateRequest($request);

        $user = User::findOrFail($id);

        $auth = $this->authenticateSelfRequest($caller, $user);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if self-request validation fails
        }

        if ($request->has('is_admin') && !$caller->is_admin) {
            return response()->json(['error' => 'Forbidden'], 403); // Only admins can update is_admin status
        }

        $user->update($request->all());

        return response()->json($user, 200);
    }

    public function me(Request $request) {
        $auth = $this->authenticateRequest($request, false);
        if ($auth instanceof JsonResponse) {
            return $auth; // Return error response if authentication fails
        }

        /** @var User $caller */
        $caller = $auth; // The authenticated user

        return response()->json($caller, 200);
    }

    function validateRequest(Request $request): void
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->id,
            'password' => 'required|string|min:8|confirmed',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = User::where('email', $request->email)->first();
            return response()->json([
                'api_token' => $user->api_token,
                'user' => $user
            ], 200);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'name' => 'required|string|max:255',
        ]);

        $is_first_user = User::count() === 0;
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // hashed by laravel
            'is_admin' => $is_first_user, // give the first user admin rights
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'api_token' => $user->api_token,
            'user' => $user
        ], 201);
    }
}
