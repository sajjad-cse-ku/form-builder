<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    /**
     * Display a listing of brands
     */
    public function index(): Response
    {
        $brands = Brand::where('active', true)->get()->map(function ($brand) {
            return [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'description' => $brand->description,
                'country' => $brand->country,
                'website' => $brand->website,
                // Generate review form URL
                'review_url' => route('form.public', [
                    'key' => 'brand_review',
                    'model' => 'Brand',
                    'id' => $brand->id,
                ]),
            ];
        });

        return Inertia::render('Brands/Index', [
            'brands' => $brands,
        ]);
    }

    /**
     * Display a single brand
     */
    public function show(Brand $brand): Response
    {
        return Inertia::render('Brands/Show', [
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'description' => $brand->description,
                'country' => $brand->country,
                'website' => $brand->website,
                'review_url' => route('form.public', [
                    'key' => 'brand_review',
                    'model' => 'Brand',
                    'id' => $brand->id,
                ]),
            ],
        ]);
    }
}
