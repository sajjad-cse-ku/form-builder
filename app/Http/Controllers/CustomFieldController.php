<?php

namespace App\Http\Controllers;

use App\Models\CustomField;
use App\Models\FieldGroup;
use Illuminate\Http\Request;

class CustomFieldController extends Controller
{
    public function store(Request $request, FieldGroup $fieldGroup)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'key' => 'required|string|unique:custom_fields,key',
            'type' => 'required|string',
            'instructions' => 'nullable|string',
            'required' => 'boolean',
            'default_value' => 'nullable',
            'placeholder' => 'nullable|string',
            'choices' => 'nullable|array',
            'multiple' => 'boolean',
            'model_type' => 'nullable|string',
            'conditional_logic' => 'nullable|array',
            'wrapper' => 'nullable|array',
            'order' => 'nullable|integer',
        ]);

        $validated['field_group_id'] = $fieldGroup->id;

        $field = CustomField::create($validated);

        return back()->with('field', $field);
    }

    public function update(Request $request, CustomField $customField)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'key' => 'required|string|unique:custom_fields,key,' . $customField->id,
            'type' => 'required|string',
            'instructions' => 'nullable|string',
            'required' => 'boolean',
            'default_value' => 'nullable',
            'placeholder' => 'nullable|string',
            'choices' => 'nullable|array',
            'multiple' => 'boolean',
            'model_type' => 'nullable|string',
            'conditional_logic' => 'nullable|array',
            'wrapper' => 'nullable|array',
            'order' => 'nullable|integer',
        ]);

        $customField->update($validated);

        return back();
    }

    public function destroy(CustomField $customField)
    {
        $customField->delete();

        return back();
    }

    public function reorder(Request $request, FieldGroup $fieldGroup)
    {
        $validated = $request->validate([
            'fields' => 'required|array',
            'fields.*.id' => 'required|exists:custom_fields,id',
            'fields.*.order' => 'required|integer',
        ]);

        foreach ($validated['fields'] as $fieldData) {
            CustomField::where('id', $fieldData['id'])
                ->update(['order' => $fieldData['order']]);
        }

        return back();
    }
}
