# Advanced Custom Fields (ACF) System

A comprehensive WordPress-like Advanced Custom Fields system for Laravel + React + Inertia.js applications.

## Features

- ✅ **Multiple Field Types**: Text, Textarea, Number, Email, URL, Password, Select, Checkbox, Radio, Date, DateTime, Time, Color, True/False
- ✅ **Select Field Options**: Single and multiple selection with custom key-value pairs
- ✅ **Field Groups**: Organize fields into logical groups
- ✅ **Visual Form Builder**: Drag-and-drop interface to create and manage fields
- ✅ **Dynamic Loading**: Load fields based on any model
- ✅ **Polymorphic Relations**: Attach custom fields to any model
- ✅ **Validation**: Built-in required field validation
- ✅ **Flexible Storage**: Store values as JSON for complex data types

## Installation

### 1. Run Migrations

```bash
php artisan migrate
```

This will create three tables:
- `field_groups` - Contains field group definitions
- `custom_fields` - Contains field definitions
- `field_values` - Stores the actual field values

### 2. Add Trait to Models

Add the `HasCustomFields` trait to any model you want to support custom fields:

```php
use App\Models\Traits\HasCustomFields;

class YourModel extends Model
{
    use HasCustomFields;
}
```

### 3. Configure Routes

Routes are already configured in `routes/web.php` and `routes/api.php`.

## Usage

### Creating Field Groups

1. Navigate to `/field-groups`
2. Click "Add Field Group"
3. Fill in the details:
   - **Title**: Display name for the field group
   - **Key**: Unique identifier (auto-generated from title)
   - **Description**: Optional description
   - **Position**: Display order
   - **Active**: Enable/disable the field group

### Adding Fields to Groups

1. Go to `/field-groups/{id}/edit`
2. Click "Add Field"
3. Configure the field:
   - **Label**: Display label
   - **Name**: Field name (auto-generated)
   - **Key**: Unique identifier (auto-generated with `field_` prefix)
   - **Field Type**: Choose from available types
   - **Instructions**: Helper text for users
   - **Required**: Make field mandatory
   - **Placeholder**: Placeholder text for inputs

### Field Types and Options

#### Select, Checkbox, and Radio Fields

For select, checkbox, and radio fields, you can add **custom key-value pairs**:

1. In the field modal, scroll to the "Choices" section
2. Add choices in the format:
   - **Key**: The value saved to database (e.g., `option1`, `red`, `large`)
   - **Label**: Display text shown to users (e.g., `Option 1`, `Red`, `Large`)
3. Example:
   ```
   Key: small → Label: Small Size
   Key: medium → Label: Medium Size
   Key: large → Label: Large Size
   ```

#### Multiple Select

Enable "Multiple Selection" checkbox for select fields to allow users to choose multiple options.

### Using Custom Fields in Your Application

#### Basic Usage in React Component

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';

export default function EditUser({ user }) {
  return (
    <div>
      <h1>Edit User</h1>
      
      {/* Automatically loads and saves fields for the User model */}
      <CustomFieldsForm 
        model="User" 
        entityId={user.id} 
      />
    </div>
  );
}
```

#### Custom Submit Handler

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';
import { router } from '@inertiajs/react';

export default function EditProduct({ product }) {
  const handleSubmit = (values) => {
    // Custom logic before saving
    console.log('Field values:', values);
    
    // Save via Inertia
    router.post(`/products/${product.id}/custom-fields`, {
      values: values
    });
  };

  return (
    <CustomFieldsForm 
      model="Product" 
      entityId={product.id}
      onSubmit={handleSubmit}
    />
  );
}
```

#### Read-Only Mode

```tsx
<CustomFieldsForm 
  model="User" 
  entityId={user.id}
  readonly={true}
/>
```

### Backend Usage

#### Save Field Values

```php
use App\Models\User;

$user = User::find(1);

// Save a single field
$user->setCustomField('field_phone_number', '123-456-7890');

// Save multiple fields
$user->setCustomField('field_company', 'Acme Corp');
$user->setCustomField('field_position', 'Developer');
```

#### Retrieve Field Values

```php
// Get a single field value
$phoneNumber = $user->getCustomField('field_phone_number');

// Get all custom fields for a user
$allFields = $user->getAllCustomFields();
// Returns: ['field_phone_number' => ['123-456-7890'], 'field_company' => ['Acme Corp'], ...]
```

#### Working with Relationships

```php
// Load user with field values
$user = User::with('fieldValues.customField')->find(1);

// Get field values
foreach ($user->fieldValues as $fieldValue) {
    echo $fieldValue->customField->label . ': ';
    echo implode(', ', $fieldValue->value);
}
```

## API Endpoints

### Get Fields for Model

```
POST /api/acf/fields
```

**Request:**
```json
{
  "model": "User",
  "entity_id": 1
}
```

**Response:**
```json
{
  "fieldGroups": [...],
  "values": {
    "field_phone_number": ["123-456-7890"],
    "field_company": ["Acme Corp"]
  }
}
```

### Save Field Values

```
POST /api/acf/values
```

**Request:**
```json
{
  "model": "User",
  "entity_id": 1,
  "values": {
    "field_phone_number": ["123-456-7890"],
    "field_company": ["Acme Corp"]
  }
}
```

## Available Field Types

| Type | Description | Supports Multiple |
|------|-------------|-------------------|
| `text` | Single line text input | No |
| `textarea` | Multi-line text area | No |
| `number` | Numeric input | No |
| `email` | Email address input | No |
| `url` | URL input | No |
| `password` | Password input | No |
| `select` | Dropdown selection | Yes |
| `checkbox` | Multiple checkboxes | Yes (built-in) |
| `radio` | Radio button group | No |
| `date` | Date picker | No |
| `datetime` | Date and time picker | No |
| `time` | Time picker | No |
| `color` | Color picker | No |
| `true_false` | Boolean checkbox | No |

## Database Schema

### field_groups
- `id` - Primary key
- `title` - Display title
- `key` - Unique identifier
- `description` - Optional description
- `location` - JSON rules for placement (future use)
- `position` - Display order
- `active` - Enable/disable status

### custom_fields
- `id` - Primary key
- `field_group_id` - Foreign key to field_groups
- `label` - Display label
- `name` - Field name
- `key` - Unique identifier
- `type` - Field type (text, select, etc.)
- `instructions` - Help text
- `required` - Boolean
- `default_value` - JSON default value
- `placeholder` - Placeholder text
- `choices` - JSON key-value pairs for select/checkbox/radio
- `multiple` - Enable multiple selection
- `conditional_logic` - JSON conditions (future use)
- `wrapper` - JSON wrapper settings (width, class, id)
- `order` - Display order

### field_values
- `id` - Primary key
- `custom_field_id` - Foreign key to custom_fields
- `entity_type` - Model class name (polymorphic)
- `entity_id` - Model ID (polymorphic)
- `value` - JSON stored value

## Example: Product Custom Fields

### 1. Create a Product Model

```php
<?php

namespace App\Models;

use App\Models\Traits\HasCustomFields;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasCustomFields;

    protected $fillable = ['name', 'price', 'description'];
}
```

### 2. Create Field Group via UI

- Title: "Product Details"
- Key: `product_details`

### 3. Add Fields

**Field 1: Color**
- Label: "Product Color"
- Type: Select
- Choices:
  - `red` → "Red"
  - `blue` → "Blue"
  - `green` → "Green"
- Multiple: No

**Field 2: Sizes**
- Label: "Available Sizes"
- Type: Select
- Choices:
  - `xs` → "Extra Small"
  - `s` → "Small"
  - `m` → "Medium"
  - `l` → "Large"
  - `xl` → "Extra Large"
- Multiple: Yes (allows multiple selections)

**Field 3: Features**
- Label: "Product Features"
- Type: Checkbox
- Choices:
  - `waterproof` → "Waterproof"
  - `organic` → "Organic"
  - `handmade` → "Handmade"

### 4. Use in React Component

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';

export default function EditProduct({ product }) {
  return (
    <div>
      <h1>Edit Product: {product.name}</h1>
      
      {/* Regular product fields */}
      <input name="name" value={product.name} />
      <input name="price" value={product.price} />
      
      {/* Custom fields */}
      <CustomFieldsForm model="Product" entityId={product.id} />
    </div>
  );
}
```

## Demo

Visit `/acf-demo` to see a working example with the User model.

## Customization

### Adding New Field Types

1. Add the field type to `resources/js/types/acf.ts`:

```typescript
export type FieldType = 
  | 'text'
  | 'your_new_type';
```

2. Add rendering logic in `resources/js/components/ACF/FieldRenderer.tsx`:

```tsx
case 'your_new_type':
  return <YourCustomComponent />;
```

3. Add to field types list in `resources/js/pages/ACF/FieldGroups/Edit.tsx`:

```tsx
{ value: 'your_new_type', label: 'Your New Type' }
```

## Tips & Best Practices

1. **Use Descriptive Keys**: Always use clear, descriptive keys like `field_phone_number` rather than `field_1`
2. **Group Related Fields**: Organize fields into logical groups (e.g., "Contact Info", "Product Details")
3. **Add Instructions**: Help users understand what each field is for
4. **Validate Required Fields**: Mark important fields as required
5. **Manual Key-Value Pairs**: For select/checkbox/radio fields, always define meaningful keys that won't change even if the display labels do

## Troubleshooting

### Fields Not Saving

- Ensure the model has the `HasCustomFields` trait
- Check API routes are registered in `bootstrap/app.php`
- Verify CSRF token is being sent with requests

### Fields Not Displaying

- Confirm field group is marked as "Active"
- Check that fields have been added to the group
- Verify model name matches exactly (case-sensitive)

## License

This ACF system is part of your Laravel application.
