<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ACF API Routes
Route::middleware('auth:sanctum')->prefix('acf')->group(function () {
    Route::post('/fields', [\App\Http\Controllers\FieldValueController::class, 'getFields']);
    Route::post('/values', [\App\Http\Controllers\FieldValueController::class, 'saveValues']);
});
