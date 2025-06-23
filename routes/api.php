<?php

use App\Http\Controllers\UserAchievementController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AchievementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::delete('/user/{id}', [UserController::class, 'delete']);
Route::put('/user/{id}', [UserController::class, 'update']);
Route::get('/user/{id}', [UserController::class, 'show']);
Route::post('/user', [UserController::class, 'store']);
Route::get('/user', [UserController::class, 'index']);


Route::get('/achievement', [AchievementController::class, 'index']);
Route::get('/achievement/{id}', [AchievementController::class, 'show']);
Route::post('/achievement', [AchievementController::class, 'store']);
Route::delete('/achievement/{id}', [AchievementController::class, 'delete']);
Route::put('/achievement/{id}', [AchievementController::class, 'update']);

Route::post('/{userId}/assign/{achievementId}', [UserAchievementController::class, 'assign']);
