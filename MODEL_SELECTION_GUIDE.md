# Model Selection & Form Link Guide

Complete guide on selecting models and generating form links with model data.

## 🎯 Flow Overview

```
User clicks link → Controller gets model → Generates form URL with model ID → 
Form opens with model info displayed → User submits → Submission linked to model
```

## 📝 Step-by-Step Implementation

### Step 1: Controller - Get Model & Generate URL

**Example: Category Controller**
```php
// app/Http/Controllers/CategoryController.php
public function show(Category $category)
{
    return Inertia::render('Categories/Show', [
        'category' => [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            // Generate form URL with model
            'feedback_url' => route('form.public', [
                'key' => 'category_feedback',  // Form key
                'model' => 'Category',          // Model name
                'id' => $category->id,          // Model ID
            ]),
        ],
    ]);
}
```

### Step 2: React Component - Display Link

```tsx
// resources/js/pages/Categories/Show.tsx
export default function Show({ category }) {
  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      
      {/* Form link with model data */}
      <a href={category.feedback_url} target="_blank">
        <button>Give Feedback for {category.name}</button>
      </a>
    </div>
  );
}
```

### Step 3: User Clicks Link

URL generated:
```
/form/category_feedback?model=Category&id=1
```

### Step 4: Form Opens with Model Data

The form automatically:
1. Reads `?model=Category&id=1` from URL
2. Loads Category #1 from database
3. Displays category info at top of form

**What user sees:**
```
┌─────────────────────────────────────┐
│  ℹ️  This form is for:              │
│  Electronics Category               │
│  Latest gadgets and devices         │
└─────────────────────────────────────┘

[Feedback Form Fields]
```

## 🔧 Complete Examples

### Example 1: Category List with Feedback Links

**Controller:**
```php
public function index()
{
    $categories = Category::all()->map(function ($cat) {
        return [
            'id' => $cat->id,
            'name' => $cat->name,
            'feedback_url' => route('form.public', [
                'key' => 'category_feedback',
                'model' => 'Category',
                'id' => $cat->id,
            ]),
        ];
    });

    return Inertia::render('Categories/Index', [
        'categories' => $categories
    ]);
}
```

**React Component:**
```tsx
export default function CategoriesIndex({ categories }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="card">
          <h3>{category.name}</h3>
          <a href={category.feedback_url} target="_blank">
            <button>Give Feedback</button>
          </a>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Brand Page with Review Form

**Controller:**
```php
public function show(Brand $brand)
{
    return Inertia::render('Brands/Show', [
        'brand' => $brand,
        'reviewUrl' => route('form.public', [
            'key' => 'brand_review',
            'model' => 'Brand',
            'id' => $brand->id,
        ]),
    ]);
}
```

**React:**
```tsx
export default function BrandShow({ brand, reviewUrl }) {
  return (
    <div>
      <h1>{brand.name}</h1>
      <p>Country: {brand.country}</p>
      <a href={reviewUrl}>Write a Review</a>
    </div>
  );
}
```

### Example 3: School Admission with Auto-link

**Using Model Accessor:**
```php
// In School model
public function getAdmissionFormUrlAttribute()
{
    return route('form.public', [
        'key' => 'school_admission',
        'model' => 'School',
        'id' => $this->id,
    ]);
}

// In controller
public function show(School $school)
{
    return Inertia::render('Schools/Show', [
        'school' => $school, // admission_form_url auto-included
    ]);
}
```

## 🌐 URL Patterns

### Single Model Instance
```
/form/{form_key}?model={ModelName}&id={id}

Examples:
/form/category_feedback?model=Category&id=5
/form/brand_review?model=Brand&id=3
/form/school_admission?model=School&id=1
```

### Multiple Parameters (Advanced)
```php
route('form.public', [
    'key' => 'product_review',
    'model' => 'Product',
    'id' => 10,
    'ref' => 'email',  // Extra tracking
])
// Result: /form/product_review?model=Product&id=10&ref=email
```

## 🎨 Frontend Implementation

### Option 1: Direct Link
```tsx
<a href={`/form/category_feedback?model=Category&id=${category.id}`}>
  Give Feedback
</a>
```

### Option 2: Backend Generated
```tsx
<a href={category.feedback_url}>Give Feedback</a>
```

### Option 3: Dynamic with State
```tsx
const [selectedCategory, setSelectedCategory] = useState(null);

const handleFeedback = (category) => {
  const url = `/form/category_feedback?model=Category&id=${category.id}`;
  window.open(url, '_blank');
};

<button onClick={() => handleFeedback(category)}>
  Give Feedback
</button>
```

## 🔍 What Happens Behind the Scenes

1. **User visits**: `/categories/electronics`
2. **Controller loads**: `Category::where('slug', 'electronics')->first()`
3. **Generates URL**: `/form/category_feedback?model=Category&id=1`
4. **User clicks link**
5. **Form loads**: `PublicFormController` reads `?model=Category&id=1`
6. **Loads model**: `Category::find(1)`
7. **Displays**: Shows category name/description at top of form
8. **User submits**: Saves with `related_model_type=Category`, `related_model_id=1`

## 📊 Querying Submissions

```php
// Get all feedback for Electronics category
$category = Category::find(1);
$feedback = $category->formSubmissions;

// Or query directly
$feedback = FormSubmission::where('related_model_type', Category::class)
    ->where('related_model_id', 1)
    ->get();
```

## 🚀 Quick Test

1. **Visit**: `http://localhost:8000/categories`
2. **Click** any category
3. **Click** "Give Feedback" button
4. **See** category info displayed in form
5. **Submit** form
6. **Check** submissions show category link

## 📝 Routes You Can Use Now

```
/categories          - List all categories
/categories/{slug}   - View single category with feedback link
/brands             - List all brands  
/brands/{slug}      - View single brand with review link
```

All ready to use! 🎉
