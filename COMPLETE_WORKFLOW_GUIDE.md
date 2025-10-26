# Complete Form Builder Workflow - School Example

## ✅ Everything is Already Working!

The feature you want is **fully implemented**. Here's the complete step-by-step workflow.

---

## 📋 Complete Workflow Example: School Feedback Form

### Step 1: Seed School Data (One-time setup)

First, make sure you have school records in your database:

```bash
php artisan db:seed --class=SchoolSeeder
```

This creates sample schools like:
- School Name One
- School Name Two
- Elite Academy
- etc.

---

### Step 2: Create a New Form with Linked Model

1. **Login to your application**
   - Go to: `http://localhost:5173/login`

2. **Navigate to Field Groups**
   - Go to: `http://localhost:5173/field-groups`

3. **Click "Add Field Group"** button (top-right)

4. **Fill in the form:**

   ```
   ┌─────────────────────────────────────────────┐
   │ Field Group Details                         │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Title *                                     │
   │ School Feedback Form                        │
   │                                             │
   │ Key *                                       │
   │ school_feedback_form                        │
   │                                             │
   │ Description                                 │
   │ Share your experience with our schools      │
   │                                             │
   │ Linked Model                                │
   │ [School ▼]  ← ← ← SELECT "School" HERE!    │
   │                                             │
   │ Position                                    │
   │ 0                                           │
   │                                             │
   │ ☑ Active                                    │
   │                                             │
   │         [Cancel]  [Create Field Group]      │
   └─────────────────────────────────────────────┘
   ```

5. **Click "Create Field Group"**

---

### Step 3: Add Custom Fields

After creating the form, you'll be on the Edit page. Now add fields:

1. **Click "+ Add Field"** button

2. **Add Rating Field:**
   ```
   Label: Overall Rating
   Type: Select
   Required: ✓ Yes
   
   Choices (click "Add" for each):
   Key: 1 → Label: ⭐ (1 Star)
   Key: 2 → Label: ⭐⭐ (2 Stars)
   Key: 3 → Label: ⭐⭐⭐ (3 Stars)
   Key: 4 → Label: ⭐⭐⭐⭐ (4 Stars)
   Key: 5 → Label: ⭐⭐⭐⭐⭐ (5 Stars)
   ```

3. **Add Comments Field:**
   ```
   Label: Your Feedback
   Type: Textarea
   Placeholder: Tell us about your experience...
   Required: ✓ Yes
   ```

4. **Add Recommendation Field:**
   ```
   Label: Would you recommend this school?
   Type: True/False
   Required: No
   ```

You'll see in the Custom Fields section:
```
Custom Fields
Add and manage fields in this group
[🔗 Linked to: School]
(Users will select from School records)
```

---

### Step 4: Get the Public Form URL

Scroll down to the **"Public Form"** section in the Edit page:

```
┌───────────────────────────────────────────────────┐
│ Public Form                                       │
│ Share this URL to allow others to submit this form│
├───────────────────────────────────────────────────┤
│ [http://localhost:5173/form/school_feedback_form] │
│ [Copy] [Open Form]                                │
└───────────────────────────────────────────────────┘
```

**Copy the URL** or **click "Open Form"**

---

### Step 5: User Opens the Public Form

When a user opens the URL: `http://localhost:5173/form/school_feedback_form`

They will see:

```
┌──────────────────────────────────────────────────────────┐
│                School Feedback Form                      │
│          Share your experience with our schools          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Select School *                                   │  │
│  │ [-- Select School --        ▼]                    │  │
│  │   School Name One                                 │  │
│  │   School Name Two                                 │  │
│  │   Elite Academy                                   │  │
│  │   Springfield High School                         │  │
│  │   Oakwood Elementary                              │  │
│  └───────────────────────────────────────────────────┘  │
│  Choose which School you want to provide feedback for    │
│                                                          │
│  Overall Rating *                                        │
│  [Select ▼]                                              │
│                                                          │
│  Your Feedback *                                         │
│  [Textarea: Tell us about your experience...]            │
│                                                          │
│  Would you recommend this school?                        │
│  ☐ Would you recommend this school?                     │
│                                                          │
│  [Submit]                                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**👆 The school dropdown appears automatically!**

---

### Step 6: User Selects School and Submits

1. **User selects**: "School Name One" from dropdown
2. **User selects**: "⭐⭐⭐⭐ (4 Stars)"
3. **User types**: "Great teachers and facilities!"
4. **User checks**: "Would you recommend" ✓
5. **User clicks**: "Submit"

---

### Step 7: View Submissions (Admin)

1. **Go back to**: `/field-groups`
2. **Click** the submissions badge for "School Feedback Form"
3. **See all submissions** linked to specific schools

The submission will be stored with:
- `related_model_type`: "App\Models\School"
- `related_model_id`: 1 (ID of "School Name One")
- `data`: { rating: "4", feedback: "Great teachers...", recommend: true }

---

## 🎯 Available Models

You can link forms to any of these models:

| Model | Example Records |
|-------|----------------|
| **School** | School Name One, School Name Two, Elite Academy |
| **Category** | Electronics, Clothing, Books |
| **Brand** | Apple, Samsung, Nike |
| **SchoolClass** | Class 1-A, Class 2-B, Grade 10-Science |

---

## 🔧 How It Works Behind the Scenes

### Backend (PublicFormController.php)

```php
// When linked_model is set (e.g., "School")
if ($fieldGroup->linked_model) {
    // Get the model class: App\Models\School
    $modelClass = $this->resolveModelClass($fieldGroup->linked_model);
    
    // Fetch all active schools
    $modelOptions = $modelClass::where('active', true)->get()->map(function ($item) {
        return [
            'id' => $item->id,
            'name' => $item->name,  // "School Name One"
            'description' => $item->description,
        ];
    });
}
```

### Frontend (PublicForm/Show.tsx)

```tsx
{/* Model Selection Dropdown */}
{modelOptions && !relatedModel && (
  <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
    <label>Select {linkedModelName} *</label>
    <select onChange={(e) => handleModelSelect(Number(e.target.value))}>
      <option value="">-- Select {linkedModelName} --</option>
      {modelOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
)}
```

---

## 📊 Real Examples

### Example 1: Category Feedback Form

**Create:**
- Title: "Category Feedback"
- Linked Model: **Category**

**Public Form Shows:**
```
Select Category *
[-- Select Category --  ▼]
  Electronics
  Clothing  
  Books
  Sports & Outdoors
```

### Example 2: Brand Survey

**Create:**
- Title: "Brand Survey"  
- Linked Model: **Brand**

**Public Form Shows:**
```
Select Brand *
[-- Select Brand --  ▼]
  Apple
  Samsung
  Nike
  Adidas
```

### Example 3: Class Feedback

**Create:**
- Title: "Class Feedback"
- Linked Model: **SchoolClass**

**Public Form Shows:**
```
Select SchoolClass *
[-- Select SchoolClass --  ▼]
  Class 1-A
  Class 2-B
  Grade 10-Science
```

### Example 4: General Contact (No Model)

**Create:**
- Title: "Contact Form"
- Linked Model: **None - General Form**

**Public Form Shows:**
```
(No dropdown - just the fields)

Name *
[Input]

Email *
[Input]

Message *
[Textarea]
```

---

## 🧪 Quick Test

1. **Run seeders:**
   ```bash
   php artisan db:seed --class=SchoolSeeder
   php artisan db:seed --class=CategorySeeder
   php artisan db:seed --class=BrandSeeder
   ```

2. **Create test form:**
   - Go to `/field-groups/create`
   - Title: "Test School Form"
   - Linked Model: **School**
   - Click Create

3. **Add one field:**
   - Click "+ Add Field"
   - Label: "Rating"
   - Type: Select
   - Choices: 1,2,3,4,5
   - Click "Add Field"

4. **Get public URL:**
   - Copy URL from "Public Form" section
   - Example: `http://localhost:5173/form/test_school_form`

5. **Open in incognito/new tab:**
   - You should see the School dropdown!
   - Select a school
   - Select a rating
   - Submit

6. **Check submissions:**
   - Go to `/field-groups`
   - Click submissions badge
   - See your test submission linked to the school you selected

---

## ✅ Summary

**Your form builder already has this feature working:**

1. ✅ Create form with linked model selector
2. ✅ Backend fetches model records automatically
3. ✅ Public form displays dropdown with model names
4. ✅ Submissions are saved with model relationship
5. ✅ You can view which model each submission is for

**The flow is:**
1. Admin creates form → selects linked model (e.g., School)
2. Admin adds custom fields (rating, comments, etc.)
3. Admin shares public form URL
4. User opens form → sees dropdown with all schools
5. User selects "School Name One"
6. User fills fields → submits
7. Submission is saved linked to "School Name One"

**Everything works out of the box! 🎉**
