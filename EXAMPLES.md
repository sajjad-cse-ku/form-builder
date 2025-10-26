# ACF System - Code Examples

This document contains practical examples of using the ACF system in your application.

## Table of Contents

1. [Laravel Backend Examples](#laravel-backend-examples)
2. [React Frontend Examples](#react-frontend-examples)
3. [Advanced Use Cases](#advanced-use-cases)

---

## Laravel Backend Examples

### Example 1: Save Custom Fields for a User

```php
use App\Models\User;

$user = User::find(1);

// Save single field
$user->setCustomField('field_phone_number', '555-1234');
$user->setCustomField('field_department', 'engineering');

// Save multiple select field
$user->setCustomField('field_skills', ['php', 'javascript', 'laravel']);
```

### Example 2: Retrieve Custom Field Values

```php
use App\Models\User;

$user = User::find(1);

// Get single field
$phone = $user->getCustomField('field_phone_number');
// Returns: ['555-1234']

// Get all custom fields
$allFields = $user->getAllCustomFields();
// Returns: ['field_phone_number' => ['555-1234'], 'field_department' => ['engineering'], ...]
```

### Example 3: Using the ACF Helper

```php
use App\Helpers\ACFHelper;
use App\Models\User;

$user = User::find(1);

// Set field values
ACFHelper::setFieldValue($user, 'field_phone_number', '555-1234');

// Set multiple values at once
ACFHelper::setFieldValues($user, [
    'field_phone_number' => '555-1234',
    'field_department' => 'engineering',
    'field_skills' => ['php', 'javascript', 'laravel'],
]);

// Get formatted value (converts keys to labels)
$formattedDept = ACFHelper::getFormattedFieldValue($user, 'field_department');
// Returns: "Engineering Department" (instead of "engineering")
```

### Example 4: Controller with Custom Fields

```php
namespace App\Http\Controllers;

use App\Helpers\ACFHelper;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'customFields' => ACFHelper::getFieldValues($product),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // Update regular fields
        $product->update($request->only(['name', 'price', 'description']));

        // Update custom fields
        if ($request->has('custom_fields')) {
            ACFHelper::setFieldValues($product, $request->custom_fields);
        }

        return redirect()->route('products.edit', $product);
    }
}
```

### Example 5: Clone Field Values

```php
use App\Helpers\ACFHelper;
use App\Models\Product;

$originalProduct = Product::find(1);
$newProduct = Product::create([
    'name' => 'Copy of ' . $originalProduct->name,
    'price' => $originalProduct->price,
]);

// Clone all custom field values
ACFHelper::cloneFieldValues($originalProduct, $newProduct);
```

### Example 6: Query Products by Custom Field

```php
use App\Models\Product;

// Find products with a specific color
$redProducts = Product::whereHas('fieldValues', function ($query) {
    $query->whereHas('customField', function ($q) {
        $q->where('key', 'field_color');
    })->whereJsonContains('value', 'red');
})->get();
```

### Example 7: Validation with Custom Fields

```php
use App\Helpers\ACFHelper;
use Illuminate\Http\Request;

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
    ]);

    $product = Product::create($validated);

    // Validate custom fields
    $customFieldRules = [];
    $fieldGroups = ACFHelper::getFieldGroups();
    
    foreach ($fieldGroups as $group) {
        foreach ($group->fields as $field) {
            if ($field->required) {
                $customFieldRules['custom_fields.' . $field->key] = 'required';
            }
        }
    }

    $request->validate($customFieldRules);

    // Save custom fields
    ACFHelper::setFieldValues($product, $request->custom_fields);

    return redirect()->route('products.show', $product);
}
```

---

## React Frontend Examples

### Example 1: Basic Usage

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';

export default function EditUser({ user }) {
  return (
    <div className="container mx-auto py-8">
      <h1>Edit User: {user.name}</h1>
      
      <CustomFieldsForm 
        model="User" 
        entityId={user.id} 
      />
    </div>
  );
}
```

### Example 2: Custom Submit Handler

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function EditProduct({ product }) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (values) => {
    setSaving(true);
    
    router.post(`/products/${product.id}/save-custom-fields`, 
      { custom_fields: values },
      {
        onSuccess: () => {
          alert('Saved successfully!');
        },
        onError: (errors) => {
          console.error('Save failed:', errors);
        },
        onFinish: () => {
          setSaving(false);
        },
      }
    );
  };

  return (
    <div>
      <h1>Edit Product</h1>
      
      <CustomFieldsForm 
        model="Product" 
        entityId={product.id}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

### Example 3: Using the Hook

```tsx
import { useCustomFields } from '@/hooks/useCustomFields';
import { Button } from '@/components/ui/button';
import { FieldRenderer } from '@/components/ACF/FieldRenderer';

export default function CustomForm({ user }) {
  const {
    fieldGroups,
    values,
    loading,
    error,
    updateValue,
    saveValues,
    resetValues,
  } = useCustomFields({
    model: 'User',
    entityId: user.id,
  });

  const handleSave = async () => {
    try {
      await saveValues(values);
      alert('Saved!');
    } catch (err) {
      alert('Failed to save');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      {fieldGroups.map((group) => (
        <div key={group.id}>
          <h2 className="text-xl font-bold mb-4">{group.title}</h2>
          
          {group.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={values[field.key]}
              onChange={updateValue}
            />
          ))}
        </div>
      ))}

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={resetValues}>
          Reset
        </Button>
      </div>
    </div>
  );
}
```

### Example 4: Read-Only Display

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';

export default function ViewProduct({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      
      <div className="mt-6">
        <h2>Specifications</h2>
        <CustomFieldsForm 
          model="Product" 
          entityId={product.id}
          readonly={true}
        />
      </div>
    </div>
  );
}
```

### Example 5: Conditional Rendering

```tsx
import { useCustomFields } from '@/hooks/useCustomFields';
import { FieldRenderer } from '@/components/ACF/FieldRenderer';

export default function DynamicForm({ product }) {
  const { fieldGroups, values, updateValue } = useCustomFields({
    model: 'Product',
    entityId: product.id,
  });

  return (
    <div className="space-y-4">
      {fieldGroups.map((group) =>
        group.fields.map((field) => {
          // Only show size field if color is selected
          if (field.key === 'field_sizes' && !values.field_color) {
            return null;
          }

          return (
            <FieldRenderer
              key={field.id}
              field={field}
              value={values[field.key]}
              onChange={updateValue}
            />
          );
        })
      )}
    </div>
  );
}
```

---

## Advanced Use Cases

### Use Case 1: Multi-Step Form with ACF

```tsx
import { useCustomFields } from '@/hooks/useCustomFields';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function MultiStepForm({ product }) {
  const [step, setStep] = useState(1);
  const { fieldGroups, values, updateValue, saveValues } = useCustomFields({
    model: 'Product',
    entityId: product.id,
  });

  const group1 = fieldGroups[0];
  const group2 = fieldGroups[1];

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  
  const handleSubmit = async () => {
    await saveValues(values);
    alert('All steps completed!');
  };

  return (
    <div>
      {step === 1 && group1 && (
        <div>
          <h2>{group1.title}</h2>
          {/* Render group1 fields */}
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}

      {step === 2 && group2 && (
        <div>
          <h2>{group2.title}</h2>
          {/* Render group2 fields */}
          <Button onClick={handleBack}>Back</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
}
```

### Use Case 2: API Endpoint for Custom Fields

```php
// routes/api.php
Route::get('/products/{product}/custom-fields', function (Product $product) {
    return response()->json([
        'product' => $product,
        'custom_fields' => ACFHelper::getFieldValues($product),
    ]);
});

Route::post('/products/{product}/custom-fields', function (Request $request, Product $product) {
    ACFHelper::setFieldValues($product, $request->values);
    
    return response()->json([
        'success' => true,
        'custom_fields' => ACFHelper::getFieldValues($product),
    ]);
});
```

### Use Case 3: Export Products with Custom Fields

```php
use App\Helpers\ACFHelper;
use App\Models\Product;

public function export()
{
    $products = Product::all();
    $data = [];

    foreach ($products as $product) {
        $customFields = ACFHelper::getFieldValues($product);
        
        $data[] = [
            'name' => $product->name,
            'price' => $product->price,
            'color' => ACFHelper::getFormattedFieldValue($product, 'field_color'),
            'sizes' => ACFHelper::getFormattedFieldValue($product, 'field_sizes'),
            'material' => ACFHelper::getFormattedFieldValue($product, 'field_material'),
        ];
    }

    return response()->json($data);
}
```

### Use Case 4: Blade Template Display

```php
// Controller
public function show(Product $product)
{
    return view('products.show', [
        'product' => $product,
        'customFields' => ACFHelper::getFieldValues($product),
    ]);
}
```

```blade
<!-- resources/views/products/show.blade.php -->
<div class="custom-fields">
    <h3>Specifications</h3>
    
    @foreach($customFields as $fieldKey => $value)
        <div class="field">
            <strong>{{ $fieldKey }}:</strong>
            {!! ACFHelper::getFormattedFieldValue($product, $fieldKey) !!}
        </div>
    @endforeach
</div>
```

### Use Case 5: Seeding Test Data

```php
use App\Helpers\ACFHelper;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $product = Product::create([
            'name' => 'T-Shirt',
            'price' => 29.99,
        ]);

        ACFHelper::setFieldValues($product, [
            'field_color' => 'blue',
            'field_sizes' => ['s', 'm', 'l'],
            'field_material' => 'cotton',
            'field_features' => ['organic', 'eco_friendly'],
            'field_weight' => '0.3',
        ]);
    }
}
```

### Use Case 6: Search Products by Custom Field

```tsx
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProductSearch() {
  const [filters, setFilters] = useState({
    color: '',
    size: '',
    material: '',
  });

  const handleSearch = () => {
    router.get('/products/search', filters);
  };

  return (
    <div>
      <select onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
        <option value="">All Colors</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>

      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

```php
// Backend search
public function search(Request $request)
{
    $query = Product::query();

    if ($request->color) {
        $query->whereHas('fieldValues', function ($q) use ($request) {
            $q->whereHas('customField', function ($cf) {
                $cf->where('key', 'field_color');
            })->whereJsonContains('value', $request->color);
        });
    }

    return Inertia::render('Products/Search', [
        'products' => $query->get(),
    ]);
}
```

---

## Tips

1. **Always use field keys** (`field_*`) when accessing values programmatically
2. **Use ACFHelper** for formatted output in views and emails
3. **Validate custom fields** on the backend for security
4. **Index commonly queried fields** for better performance
5. **Cache field groups** if they don't change often

## Need More Help?

- Check `ACF_README.md` for full documentation
- Review `ACF_SETUP.md` for setup instructions
- Run the example seeder: `php artisan db:seed --class=ACFExampleSeeder`
