<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ACFDemoController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('ACF/Demo', [
            'user' => $request->user(),
        ]);
    }
}
