<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ACF Routes
    Route::resource('field-groups', \App\Http\Controllers\FieldGroupController::class);
    Route::post('field-groups/{fieldGroup}/reorder-fields', [\App\Http\Controllers\FieldGroupController::class, 'reorderFields']);
    Route::post('field-groups/{fieldGroup}/fields', [\App\Http\Controllers\CustomFieldController::class, 'store']);
    Route::put('custom-fields/{customField}', [\App\Http\Controllers\CustomFieldController::class, 'update']);
    Route::delete('custom-fields/{customField}', [\App\Http\Controllers\CustomFieldController::class, 'destroy']);
    Route::post('field-groups/{fieldGroup}/fields/reorder', [\App\Http\Controllers\CustomFieldController::class, 'reorder']);
    Route::get('acf-demo', [\App\Http\Controllers\ACFDemoController::class, 'index'])->name('acf.demo');
    
    // Form Submissions
    Route::get('field-groups/{fieldGroup}/submissions', [\App\Http\Controllers\FormSubmissionController::class, 'index'])->name('field-groups.submissions.index');
    Route::get('field-groups/{fieldGroup}/submissions/{submission}', [\App\Http\Controllers\FormSubmissionController::class, 'show'])->name('field-groups.submissions.show');
    Route::delete('field-groups/{fieldGroup}/submissions/{submission}', [\App\Http\Controllers\FormSubmissionController::class, 'destroy'])->name('field-groups.submissions.destroy');
    Route::get('field-groups/{fieldGroup}/submissions/export', [\App\Http\Controllers\FormSubmissionController::class, 'export'])->name('field-groups.submissions.export');
    
    // Example Model Routes - Categories (full CRUD)
    Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/create', [\App\Http\Controllers\CategoryController::class, 'create'])->name('categories.create');
    Route::post('categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('categories.store');
    Route::get('categories/{category:slug}', [\App\Http\Controllers\CategoryController::class, 'show'])->name('categories.show');
    Route::get('categories/{category}/edit', [\App\Http\Controllers\CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.destroy');
    
    // Example Model Routes - Brands
    Route::get('brands', [\App\Http\Controllers\BrandController::class, 'index'])->name('brands.index');
    Route::get('brands/{brand:slug}', [\App\Http\Controllers\BrandController::class, 'show'])->name('brands.show');
});

// Public Form Routes (no authentication required)
Route::get('form/{key}', [\App\Http\Controllers\PublicFormController::class, 'show'])->name('form.public');
Route::post('form/{key}/submit', [\App\Http\Controllers\PublicFormController::class, 'submit'])->name('form.submit');

require __DIR__.'/settings.php';
