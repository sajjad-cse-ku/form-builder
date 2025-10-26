# ACF System - Quick Setup Guide

Follow these steps to get your Advanced Custom Fields system up and running.

## Step 1: Run Migrations

```bash
php artisan migrate
```

This creates the necessary database tables for the ACF system.

## Step 2: Install Dependencies (if needed)

Make sure all npm packages are installed:

```bash
npm install
```

## Step 3: Build Assets

```bash
npm run build
# or for development
npm run dev
```

## Step 4: Start Your Application

```bash
php artisan serve
```

## Step 5: Access the Field Group Manager

Navigate to: `http://localhost:8000/field-groups`

## Quick Start Guide

### Create Your First Field Group

1. Go to `/field-groups`
2. Click "Add Field Group"
3. Enter:
   - **Title**: "User Profile"
   - **Key**: Will auto-generate as `user_profile`
   - **Active**: Check this box
4. Click "Create Field Group"

### Add Fields to Your Group

1. Click "Edit" on your newly created field group
2. Click "Add Field" button
3. Create a text field:
   - **Label**: "Phone Number"
   - **Type**: "Text"
   - **Required**: Check if needed
   - **Placeholder**: "Enter phone number"
4. Click "Add Field"

5. Create a select field with custom options:
   - **Label**: "Department"
   - **Type**: "Select"
   - **Required**: Check if needed
   - Click "Add Choice" to add options:
     - Key: `sales` → Label: "Sales Department"
     - Key: `marketing` → Label: "Marketing Department"
     - Key: `engineering` → Label: "Engineering Department"
6. Click "Add Field"

7. Create a multiple select field:
   - **Label**: "Skills"
   - **Type**: "Select"
   - **Multiple Selection**: Check this box
   - Add choices:
     - Key: `php` → Label: "PHP"
     - Key: `javascript` → Label: "JavaScript"
     - Key: `python` → Label: "Python"
6. Click "Add Field"

### Test Your Fields

1. Navigate to `/acf-demo`
2. You should see your custom fields rendered
3. Fill them out and click "Save Fields"
4. Refresh the page - your values should persist

## Add Custom Fields to Your Own Models

### Example: Product Model

1. **Create the Model** (if it doesn't exist):

```bash
php artisan make:model Product -m
```

2. **Add the HasCustomFields trait** to `app/Models/Product.php`:

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

3. **Create a Field Group** for Products:
   - Title: "Product Details"
   - Add fields like:
     - Color (Select)
     - Size (Select with multiple)
     - Features (Checkbox)
     - Dimensions (Text)

4. **Use in Your React Component**:

```tsx
import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';

export default function EditProduct({ product }) {
  return (
    <div>
      <h1>Edit Product</h1>
      
      {/* Your regular form fields */}
      <input name="name" />
      <input name="price" />
      
      {/* ACF fields */}
      <CustomFieldsForm 
        model="Product" 
        entityId={product.id} 
      />
    </div>
  );
}
```

## Field Types Reference

| Type | Use Case | Example |
|------|----------|---------|
| **Text** | Short text input | Name, SKU, Phone |
| **Textarea** | Long text | Description, Notes |
| **Number** | Numeric values | Quantity, Weight |
| **Email** | Email addresses | Contact Email |
| **Select** | Dropdown choices | Category, Status |
| **Select (Multiple)** | Multiple choices | Tags, Categories |
| **Checkbox** | Multiple options | Features, Permissions |
| **Radio** | Single choice | Gender, Priority |
| **Date** | Date selection | Birth Date, Due Date |
| **True/False** | Boolean | Is Featured, Is Active |

## Tips for Select Fields

### Single Select
- Use when user should choose ONE option
- Example: Product Category, User Role

### Multiple Select
- Enable "Multiple Selection" checkbox
- Use when user can choose MULTIPLE options
- Example: Skills, Tags, Categories

### Custom Key-Value Pairs
Always use meaningful keys that won't change:

✅ **Good:**
```
Key: small → Label: Small Size
Key: medium → Label: Medium Size
Key: large → Label: Large Size
```

❌ **Bad:**
```
Key: 1 → Label: Small Size
Key: 2 → Label: Medium Size
```

**Why?** Keys are stored in the database. If you change labels, the data remains intact. If you use numbers, you might get confused later.

## Accessing Field Values in Backend

```php
// In your controller
$user = User::find(1);

// Get single field
$phone = $user->getCustomField('field_phone_number');

// Get all custom fields
$allFields = $user->getAllCustomFields();

// Set field value
$user->setCustomField('field_phone_number', '123-456-7890');

// Set multiple select values
$user->setCustomField('field_skills', ['php', 'javascript', 'python']);
```

## Next Steps

1. ✅ Read the full documentation in `ACF_README.md`
2. ✅ Create field groups for your models
3. ✅ Add the `HasCustomFields` trait to models that need custom fields
4. ✅ Integrate `CustomFieldsForm` component in your pages
5. ✅ Test with the demo at `/acf-demo`

## Need Help?

- Check `ACF_README.md` for detailed documentation
- Review the demo implementation in `resources/js/pages/ACF/Demo.tsx`
- Examine the `CustomFieldsForm` component source code

## Architecture Overview

```
Database Tables:
├── field_groups      → Groups of fields
├── custom_fields     → Individual field definitions
└── field_values      → Stored values (polymorphic)

Laravel:
├── Models/
│   ├── FieldGroup.php
│   ├── CustomField.php
│   ├── FieldValue.php
│   └── Traits/HasCustomFields.php
└── Controllers/
    ├── FieldGroupController.php
    ├── CustomFieldController.php
    └── FieldValueController.php

React:
├── components/ACF/
│   ├── FieldRenderer.tsx     → Renders individual fields
│   └── CustomFieldsForm.tsx  → Main form component
└── pages/ACF/
    ├── FieldGroups/
    │   ├── Index.tsx          → List field groups
    │   ├── Create.tsx         → Create new group
    │   └── Edit.tsx           → Edit group & fields
    └── Demo.tsx               → Example usage
```

Happy coding! 🚀
