# Example Models Setup Guide

This guide shows you how to use the example models with the form builder.

## 📦 What's Included

### Models:
1. **Category** - Product categories (Electronics, Fashion, etc.)
2. **Brand** - Product brands (Apple, Samsung, Nike, etc.)
3. **School** - Educational institutions
4. **SchoolClass** - Classes within schools

## 🚀 Quick Setup

### Step 1: Run Migrations
```bash
php artisan migrate
```

### Step 2: Seed Data
```bash
php artisan db:seed --class=ExampleModelsSeeder
```

Creates:
- **8 Categories**: Electronics, Fashion, etc.
- **10 Brands**: Apple, Samsung, Nike, etc.
- **5 Schools**: Greenwood High, Riverside Academy, etc.
- **40+ Classes**: Various grades

## 🔧 Usage

### Category Feedback
```php
$category = Category::where('slug', 'electronics')->first();
$formUrl = $category->feedback_url;
```

### Brand Review
```php
$brand = Brand::where('slug', 'apple')->first();
$reviewUrl = $brand->review_url;
```

### School Admission
```php
$school = School::find(1);
$admissionUrl = $school->admission_form_url;
```

### Class Enrollment
```php
$class = SchoolClass::find(1);
$enrollUrl = $class->enrollment_form_url;
```

## 📊 Query Submissions

```php
// Get submissions for a category
$category = Category::find(1);
$submissions = $category->formSubmissions;

// Count submissions per brand
$brands = Brand::withCount('formSubmissions')->get();
```

## 🎯 Next Steps

1. Create field groups for each model type
2. Generate form links
3. Share links with users
4. View submissions in dashboard

Check CATEGORY_FORM_EXAMPLE.md for complete examples!
