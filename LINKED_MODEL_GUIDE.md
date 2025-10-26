# Linked Model Feature Guide

## ✅ Feature Added Successfully!

You can now select a **Linked Model** when creating or editing field groups. This allows users to submit forms for specific model records.

## What is a Linked Model?

A linked model connects your form to a specific database model (like Category, Brand, School, etc.). When users access the public form:

1. **Without direct link**: They see a dropdown to select which record they want to submit for
2. **With direct link**: The form is pre-filled for a specific record

## How to Use

### Step 1: Create a Form with Linked Model

1. Go to **Field Groups** (`/field-groups`)
2. Click **"Add Field Group"**
3. Fill in the form:
   ```
   Title: Category Feedback
   Key: category_feedback
   Description: Share your feedback about our categories
   Linked Model: Category    ← NEW! Select from dropdown
   Active: ✓
   ```
4. Click **"Create Field Group"**
5. Add your fields (e.g., Rating, Comments, etc.)

### Step 2: How Users Access the Form

**Option A: General Form (Model Selection)**
```
URL: /form/category_feedback
```
- Shows a dropdown with all active categories
- User selects which category to provide feedback for
- Submits the form

**Option B: Direct Model Link**
```
URL: /form/category_feedback?model=Category&id=1
```
- Pre-selects Category with ID 1
- Shows category name and description
- User just fills the form and submits

## Available Models

The following models are available in the dropdown:

| Model | Value | Description |
|-------|-------|-------------|
| None | `''` | General form (no model link) |
| Category | `Category` | Link to categories |
| Brand | `Brand` | Link to brands |
| School | `School` | Link to schools |
| School Class | `SchoolClass` | Link to school classes |

## Example Use Cases

### 1. Category Feedback Form
```
Linked Model: Category
Fields:
- Rating (select: 1-5 stars)
- What did you like? (textarea)
- What can be improved? (textarea)
- Would you recommend? (true_false)

Public URL: /form/category_feedback
Direct URL: /form/category_feedback?model=Category&id=5
```

### 2. School Review Form
```
Linked Model: School
Fields:
- Overall Rating (select: 1-5)
- Teaching Quality (select: 1-5)
- Facilities (select: 1-5)
- Review (textarea)

Public URL: /form/school_review
Direct URL: /form/school_review?model=School&id=3
```

### 3. Brand Survey
```
Linked Model: Brand
Fields:
- How often do you purchase? (select)
- Satisfaction Level (select: 1-5)
- Favorite Products (checkbox)
- Comments (textarea)

Public URL: /form/brand_survey
Direct URL: /form/brand_survey?model=Brand&id=2
```

### 4. General Contact Form (No Model)
```
Linked Model: None - General Form
Fields:
- Name (text)
- Email (email)
- Subject (select)
- Message (textarea)

Public URL: /form/contact
```

## Backend Integration

The linked model is automatically handled by the system:

### In Controller (PublicFormController.php)
```php
// Fetches all active records of the linked model
if ($fieldGroup->linked_model) {
    $modelClass = $this->resolveModelClass($fieldGroup->linked_model);
    $modelOptions = $modelClass::where('active', true)->get();
}

// Or fetches specific record from URL params
if ($request->has('model') && $request->has('id')) {
    $modelClass = $this->resolveModelClass($request->model);
    $relatedModel = $modelClass::find($request->id);
}
```

### In Model
```php
// Category.php (example)
public function formSubmissions()
{
    return $this->morphMany(FormSubmission::class, 'related_model');
}

// Get feedback URL for this category
public function getFeedbackUrlAttribute()
{
    return route('form.public', [
        'key' => 'category_feedback',
        'model' => 'Category',
        'id' => $this->id,
    ]);
}
```

## Form Submissions

Submissions are linked to the model record:

```php
$submission = FormSubmission::create([
    'field_group_id' => $fieldGroup->id,
    'related_model_type' => 'App\\Models\\Category',  // Polymorphic
    'related_model_id' => 5,                          // Category ID
    'data' => [...],                                   // Form data
    'ip_address' => '...',
    'user_agent' => '...',
]);
```

You can then query submissions for a specific model:

```php
// Get all feedback for Category ID 5
$submissions = FormSubmission::where('related_model_type', 'App\\Models\\Category')
    ->where('related_model_id', 5)
    ->get();

// Or use the relationship
$category = Category::find(5);
$feedback = $category->formSubmissions;
```

## Adding More Models

To add more models to the dropdown, edit both Create.tsx and Edit.tsx:

```tsx
// In Create.tsx and Edit.tsx
const availableModels = [
  { value: '', label: 'None - General Form' },
  { value: 'Category', label: 'Category' },
  { value: 'Brand', label: 'Brand' },
  { value: 'School', label: 'School' },
  { value: 'SchoolClass', label: 'School Class' },
  { value: 'Product', label: 'Product' },  // Add new model here
  { value: 'Teacher', label: 'Teacher' },  // Add new model here
];
```

Make sure the model:
1. Exists in `app/Models/`
2. Has an `active` column (or modify the query)
3. Has a `name` or `title` column for display
4. Implements the `formSubmissions()` relationship

## Testing

1. **Create a form with linked model:**
   - Create field group "Test Feedback"
   - Select "Category" as linked model
   - Add a rating field

2. **Test general form:**
   - Visit `/form/test_feedback`
   - Should see dropdown with all categories
   - Select one, fill form, submit

3. **Test direct link:**
   - Visit `/form/test_feedback?model=Category&id=1`
   - Should show "This form is for: Category Name"
   - Fill form, submit

4. **Test without linked model:**
   - Create field group with "None - General Form"
   - Visit public URL
   - No dropdown shown, just form fields

## Changes Made

### Frontend Files
- ✅ `resources/js/pages/ACF/FieldGroups/Create.tsx` - Added linked_model dropdown
- ✅ `resources/js/pages/ACF/FieldGroups/Edit.tsx` - Added linked_model dropdown
- ✅ `resources/js/types/acf.ts` - Updated FieldGroup interface

### Backend Files
- ✅ Already implemented in `app/Http/Controllers/PublicFormController.php`
- ✅ Already implemented in `app/Http/Controllers/FieldGroupController.php`
- ✅ Already implemented in `database/migrations/..._create_field_groups_table.php`

## Result

Now when you create or edit a field group, you'll see a **"Linked Model"** dropdown that allows you to:
- Select "None - General Form" for regular forms
- Select "Category", "Brand", "School", or "SchoolClass" to link the form to that model

The public form will automatically:
- Show a model selection dropdown if linked_model is set
- Fetch all active records of that model
- Display model info if accessed via direct link
- Save the relationship in form submissions

**Your form builder is now complete with model linking functionality! 🎉**
