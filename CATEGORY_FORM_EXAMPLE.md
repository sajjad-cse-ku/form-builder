# Using Forms with Models (Category Example)

This guide shows how to link forms to specific model instances, so users see which category/product/item they're submitting a form for.

## 🎯 Use Case Example

You have a **Category** model and want to collect:
- Product suggestions for a specific category
- Feedback about a category
- Questions about a category

When users open the form, they should see which category it's for.

## 📝 Step 1: Run Migration

```bash
php artisan migrate
```

This adds `related_model_type` and `related_model_id` to form_submissions.

## 🏗️ Step 2: Create Your Category Model (if not exists)

```bash
php artisan make:model Category -m
```

**Migration** (`database/migrations/xxxx_create_categories_table.php`):
```php
public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->timestamps();
    });
}
```

**Model** (`app/Models/Category.php`):
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description'];
}
```

Run migration:
```bash
php artisan migrate
```

## 📋 Step 3: Create Your Form

1. Go to `/field-groups`
2. Create a new field group:
   ```
   Title: Product Feedback
   Key: product_feedback
   Description: Share your thoughts about our products
   ```

3. Add fields:
   - **Product Name** (Text, Required)
   - **Rating** (Select with choices: 1-5 stars)
   - **Comments** (Textarea, Required)
   - **Would Buy Again** (True/False)

## 🔗 Step 4: Generate Links with Category

### Option A: In Your Controller

```php
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function show(Category $category)
    {
        // Generate form URL with category
        $formUrl = route('form.public', [
            'key' => 'product_feedback',
            'model' => 'Category',
            'id' => $category->id,
        ]);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'feedbackFormUrl' => $formUrl,
        ]);
    }
}
```

### Option B: In Your Blade/React View

**React (Inertia):**
```tsx
import { Link } from '@inertiajs/react';

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CategoryPage({ category }: { category: Category }) {
  const formUrl = `/form/product_feedback?model=Category&id=${category.id}`;

  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      
      <a href={formUrl} target="_blank">
        <button>Give Feedback on {category.name}</button>
      </a>
    </div>
  );
}
```

**Blade:**
```blade
<a href="{{ route('form.public', [
    'key' => 'product_feedback',
    'model' => 'Category',
    'id' => $category->id
]) }}" 
   target="_blank"
   class="btn btn-primary">
    Give Feedback on {{ $category->name }}
</a>
```

### Option C: Generate Links Programmatically

```php
use App\Models\Category;

// Get all categories with feedback form links
$categories = Category::all()->map(function ($category) {
    return [
        'id' => $category->id,
        'name' => $category->name,
        'description' => $category->description,
        'feedback_url' => route('form.public', [
            'key' => 'product_feedback',
            'model' => 'Category',
            'id' => $category->id,
        ]),
    ];
});
```

## 📊 Step 5: View Submissions with Category Info

Go to `/field-groups/{id}/submissions` and you'll see:
- Which category each submission is for
- All form responses
- Filter by category (coming in next update)

### Access in Code

```php
use App\Models\FormSubmission;

// Get all submissions for a specific category
$category = Category::find(1);
$submissions = FormSubmission::where('related_model_type', Category::class)
    ->where('related_model_id', $category->id)
    ->get();

// Get the related category from a submission
$submission = FormSubmission::find(1);
$category = $submission->relatedModel; // Automatically loads the Category

echo "Submission for: " . $category->name;
```

## 🎨 What Users See

When someone clicks the form link:

```
┌─────────────────────────────────────┐
│  ℹ️  This form is for:              │
│  Electronics Category               │
│  Shop the latest gadgets and tech  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Product Feedback             │
│  Share your thoughts about our...   │
│                                     │
│  Product Name: [______________]     │
│  Rating: [Select...▼]              │
│  Comments: [________________]       │
│  Would Buy Again: ☐                │
│                                     │
│          [Submit]                   │
└─────────────────────────────────────┘
```

## 🔥 Real-World Examples

### Example 1: Product Feedback per Category

```php
// routes/web.php
Route::get('categories/{category}', function (Category $category) {
    return Inertia::render('Categories/Show', [
        'category' => $category,
        'feedbackUrl' => route('form.public', [
            'key' => 'product_feedback',
            'model' => 'Category',
            'id' => $category->id,
        ]),
    ]);
});
```

### Example 2: Support Tickets per Product

```php
// Product model has support form
class Product extends Model
{
    public function getSupportFormUrlAttribute()
    {
        return route('form.public', [
            'key' => 'support_ticket',
            'model' => 'Product',
            'id' => $this->id,
        ]);
    }
}

// In your view
<a href="{{ $product->support_form_url }}">Get Support</a>
```

### Example 3: Event Registration

```php
// Event RSVP form linked to specific event
$event = Event::find(5);
$rsvpUrl = route('form.public', [
    'key' => 'event_rsvp',
    'model' => 'Event',
    'id' => $event->id,
]);
```

### Example 4: Course Enrollment

```php
// Students enroll in specific courses
$course = Course::find(10);
$enrollUrl = route('form.public', [
    'key' => 'course_enrollment',
    'model' => 'Course',
    'id' => $course->id,
]);
```

## 📈 Query Submissions by Model

```php
use App\Models\Category;
use App\Models\FormSubmission;

// Get all feedback for Electronics category
$electronics = Category::where('name', 'Electronics')->first();
$feedback = FormSubmission::where('related_model_type', Category::class)
    ->where('related_model_id', $electronics->id)
    ->with('relatedModel')
    ->get();

// Count submissions per category
$submissionCounts = Category::all()->map(function ($category) {
    return [
        'category' => $category->name,
        'submissions' => FormSubmission::where('related_model_type', Category::class)
            ->where('related_model_id', $category->id)
            ->count(),
    ];
});
```

## 🎯 Advanced: Add to Category Model

Add this method to your Category model:

```php
// app/Models/Category.php
use App\Models\FormSubmission;

class Category extends Model
{
    // ... existing code ...

    public function formSubmissions()
    {
        return $this->morphMany(FormSubmission::class, 'related_model');
    }

    public function getFeedbackUrlAttribute()
    {
        return route('form.public', [
            'key' => 'product_feedback',
            'model' => 'Category',
            'id' => $this->id,
        ]);
    }
}

// Usage:
$category = Category::find(1);
echo $category->feedback_url; // Auto-generates the URL
$submissions = $category->formSubmissions; // Get all submissions
```

## 🔧 Customize Display

Edit `resources/js/pages/PublicForm/Show.tsx` to customize how model data is displayed:

```tsx
{relatedModel && (
  <Card className="mb-4 bg-blue-50 border-blue-200">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600" />
        <div>
          <p className="text-sm font-medium">This form is for:</p>
          <p className="text-lg font-bold">
            {relatedModel.data.name}
          </p>
          {/* Add custom fields */}
          {relatedModel.data.price && (
            <p className="text-sm">Price: ${relatedModel.data.price}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

## 🎉 Summary

Now you can:
- ✅ Link forms to specific categories
- ✅ Show category info when users open the form
- ✅ Store which category each submission is for
- ✅ Query submissions by category
- ✅ Works with ANY model (Product, Event, Course, etc.)

## 🔗 URL Format

```
/form/{form_key}?model={ModelName}&id={model_id}

Examples:
/form/product_feedback?model=Category&id=5
/form/support_ticket?model=Product&id=123
/form/event_rsvp?model=Event&id=50
```

Happy form building! 🚀
