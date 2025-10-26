# ACF Form Builder - Complete Guide

Your ACF system now includes a **powerful form builder** that allows you to create public forms and collect customer leads!

## 🎯 What You Can Do

- ✅ Create custom forms with any fields you need
- ✅ Get a unique public URL for each form
- ✅ Collect submissions from anyone (no login required)
- ✅ View all submissions in a dashboard
- ✅ Export submissions to CSV
- ✅ Track IP addresses and submission time

## 🚀 Quick Start

### Step 1: Run New Migration

```bash
php artisan migrate
```

This creates the `form_submissions` table.

### Step 2: Create Your Form

1. Go to `http://localhost:8000/field-groups`
2. Click "Add Field Group"
3. Create your form:
   ```
   Title: Contact Form
   Key: contact_form (auto-generated)
   Description: Get in touch with us
   ```
4. Click "Create Field Group"

### Step 3: Add Fields to Your Form

Click "Edit" on your form and add fields:

**Example: Contact Form**

1. **Name Field**
   - Label: Full Name
   - Type: Text
   - Required: ✓
   - Placeholder: John Doe

2. **Email Field**
   - Label: Email Address
   - Type: Email
   - Required: ✓
   - Placeholder: john@example.com

3. **Phone Field**
   - Label: Phone Number
   - Type: Text
   - Required: No
   - Placeholder: +1 (555) 000-0000

4. **Message Field**
   - Label: Message
   - Type: Textarea
   - Required: ✓
   - Placeholder: Tell us about your project...

5. **How Did You Hear About Us?**
   - Label: Referral Source
   - Type: Select
   - Choices:
     - `google` → Google Search
     - `social` → Social Media
     - `friend` → Friend/Colleague
     - `other` → Other

6. **Interested Services** (Multiple Select)
   - Label: Services of Interest
   - Type: Select
   - Multiple Selection: ✓
   - Choices:
     - `web_dev` → Web Development
     - `mobile_app` → Mobile App
     - `consulting` → Consulting
     - `support` → Support & Maintenance

### Step 4: Get Your Public Form Link

1. Go back to Field Groups list
2. You'll see your form with:
   - **🔗 External Link Icon** - Click to open the public form
   - **📄 FileText Icon** - Click to view submissions
   - **Submissions count** - Shows number of submissions

3. Click the 🔗 icon or go to submissions page to copy the link:
   ```
   http://localhost:8000/form/contact_form
   ```

### Step 5: Share Your Form

Share the public form URL with:
- Customers
- Website visitors
- Email campaigns
- Social media
- QR codes

Anyone can fill it out - **no login required**!

## 📊 Managing Submissions

### View All Submissions

1. Go to Field Groups
2. Click the **📄 FileText icon** or the **submissions count badge**
3. You'll see:
   - Total submission count
   - List of all submissions with preview
   - Submission date and time
   - IP addresses

### View Individual Submission

1. Click the **👁️ Eye icon** on any submission
2. You'll see:
   - All form responses
   - IP address
   - User agent (browser info)
   - Submission timestamp

### Export to CSV

1. Go to submissions list
2. Click **"Export CSV"** button
3. Get a CSV file with all data including:
   - Submission ID
   - Date & time
   - IP address
   - All field values

### Delete Submissions

Click the **🗑️ Trash icon** on any submission to delete it.

## 🎨 Public Form Features

The public form has:
- ✅ **Beautiful UI** - Professional gradient background
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Validation** - Required fields enforced
- ✅ **Success Message** - Confirmation after submission
- ✅ **Clean Layout** - Easy to read and fill out

## 💡 Use Cases

### 1. Contact Form
```
Fields:
- Name (text, required)
- Email (email, required)
- Subject (select)
- Message (textarea, required)
```

### 2. Lead Generation Form
```
Fields:
- Company Name (text, required)
- Contact Person (text, required)
- Email (email, required)
- Phone (text)
- Company Size (select)
- Services Interested (select, multiple)
- Budget Range (select)
- Project Timeline (select)
- Additional Notes (textarea)
```

### 3. Job Application Form
```
Fields:
- Full Name (text, required)
- Email (email, required)
- Phone (text, required)
- Resume Link (url)
- Position Applied (select, required)
- Years of Experience (number)
- Skills (select, multiple)
- Cover Letter (textarea)
- Available Start Date (date)
```

### 4. Event Registration
```
Fields:
- Attendee Name (text, required)
- Email (email, required)
- Phone (text)
- Number of Guests (number)
- Dietary Restrictions (checkbox)
- T-Shirt Size (radio)
- Special Requirements (textarea)
```

### 5. Survey/Feedback Form
```
Fields:
- Email (optional)
- Satisfaction Rating (radio: 1-5)
- What did you like? (checkbox, multiple)
- Suggestions (textarea)
- Would you recommend us? (true/false)
```

## 🔧 Advanced Features

### Multiple Forms

Create as many forms as you need:
- Contact Form → `/form/contact_form`
- Lead Generation → `/form/lead_gen`
- Job Applications → `/form/careers`
- Event Registration → `/form/event_2025`

Each form has its own:
- Unique URL
- Field configuration
- Submissions database

### Embed in Website

You can embed the form in your website:

```html
<iframe 
  src="http://localhost:8000/form/contact_form" 
  width="100%" 
  height="800"
  frameborder="0"
></iframe>
```

### Track Submissions

Each submission includes:
- **IP Address** - Know where submissions come from
- **User Agent** - Browser and device info
- **Timestamp** - Exact submission time
- **All form data** - Every field response

### Export & Integration

1. **CSV Export** - Import into:
   - Excel/Google Sheets
   - CRM systems
   - Email marketing tools

2. **Custom Integration** - Modify controllers to:
   - Send email notifications
   - Trigger webhooks
   - Integrate with APIs
   - Send to Slack/Discord

## 🛠️ Customization

### Email Notifications

Edit `app/Http/Controllers/PublicFormController.php`:

```php
public function submit(Request $request, string $key)
{
    // ... existing code ...
    
    $submission = FormSubmission::create([...]);
    
    // Send email notification
    Mail::to('admin@example.com')->send(
        new NewSubmissionNotification($submission)
    );
    
    return redirect()->back()->with('success', '...');
}
```

### Custom Success Message

Edit the `fieldGroup` description:
```
Description: Thank you for contacting us! We'll respond within 24 hours.
```

This appears at the top of the form.

### Styling

The public form uses:
- Tailwind CSS
- Your existing UI components
- Gradient background
- Mobile-responsive design

Edit `resources/js/pages/PublicForm/Show.tsx` to customize.

## 📈 Analytics

Track form performance:
- **Total submissions** - See on field groups list
- **Submission rate** - Export CSV and analyze trends
- **Popular choices** - See which options are selected most
- **Completion time** - Timestamps help identify patterns

## 🔒 Security Features

- ✅ **CSRF Protection** - Built-in Laravel protection
- ✅ **IP Tracking** - Detect spam/abuse
- ✅ **Validation** - Server-side required field checks
- ✅ **No Auth Required** - Public forms don't need login
- ✅ **Rate Limiting** - Can be added to prevent spam

### Add Rate Limiting (Optional)

In `routes/web.php`:

```php
Route::post('form/{key}/submit', [PublicFormController::class, 'submit'])
    ->middleware('throttle:10,1') // 10 submissions per minute
    ->name('form.submit');
```

## 📱 Share Your Form

### 1. Direct Link
```
http://localhost:8000/form/contact_form
```

### 2. QR Code
Generate a QR code for the link and put it on:
- Business cards
- Flyers
- Product packaging
- Conference materials

### 3. Social Media
Share the link on:
- Facebook
- Twitter/X
- LinkedIn
- Instagram bio

### 4. Email Campaigns
Include the form link in:
- Email signatures
- Newsletters
- Marketing emails

### 5. Website Integration
- Link from your website
- Embed as iframe
- Add to footer/header

## 🎉 That's It!

You now have a complete form builder system that can:
1. ✅ Create unlimited custom forms
2. ✅ Generate public URLs instantly
3. ✅ Collect submissions without authentication
4. ✅ View and manage all submissions
5. ✅ Export data to CSV
6. ✅ Track submission metadata

Start creating forms and collecting leads now! 🚀

## 📚 Related Documentation

- `ACF_COMPLETE.md` - Full ACF system overview
- `ACF_README.md` - Detailed ACF documentation
- `ACF_SETUP.md` - Setup instructions
- `EXAMPLES.md` - Code examples
