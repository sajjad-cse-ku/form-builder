<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(): Response
    {
        $categories = Category::where('active', true)->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'active' => $category->active,
                // Generate form URL
                'feedback_url' => route('form.public', [
                    'key' => 'category_feedback',
                    'model' => 'Category',
                    'id' => $category->id,
                ]),
            ];
        });

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display a single category
     */
    public function show(Category $category): Response
    {
        return Inertia::render('Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'active' => $category->active,
                // Generate form URL for this specific category
                'feedback_url' => route('form.public', [
                    'key' => 'category_feedback',
                    'model' => 'Category',
                    'id' => $category->id,
                ]),
            ],
        ]);
    }
}
