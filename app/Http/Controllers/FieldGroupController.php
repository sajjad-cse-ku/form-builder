<?php

namespace App\Http\Controllers;

use App\Models\FieldGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FieldGroupController extends Controller
{
    public function index(): Response
    {
        $fieldGroups = FieldGroup::withCount('submissions')
            ->with('fields')
            ->orderBy('position')
            ->get();

        return Inertia::render('ACF/FieldGroups/Index', [
            'fieldGroups' => $fieldGroups,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('ACF/FieldGroups/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'key' => 'required|string|unique:field_groups,key',
            'description' => 'nullable|string',
            'location' => 'nullable|array',
            'position' => 'nullable|integer',
            'active' => 'boolean',
        ]);

        $fieldGroup = FieldGroup::create($validated);

        return redirect()->route('field-groups.edit', $fieldGroup);
    }

    public function edit(FieldGroup $fieldGroup): Response
    {
        $fieldGroup->load('fields');

        return Inertia::render('ACF/FieldGroups/Edit', [
            'fieldGroup' => $fieldGroup,
        ]);
    }

    public function update(Request $request, FieldGroup $fieldGroup)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'key' => 'required|string|unique:field_groups,key,' . $fieldGroup->id,
            'description' => 'nullable|string',
            'location' => 'nullable|array',
            'position' => 'nullable|integer',
            'active' => 'boolean',
        ]);

        $fieldGroup->update($validated);

        return back();
    }

    public function destroy(FieldGroup $fieldGroup)
    {
        $fieldGroup->delete();

        return redirect()->route('field-groups.index');
    }

    public function reorderFields(Request $request, FieldGroup $fieldGroup)
    {
        $validated = $request->validate([
            'field_ids' => 'required|array',
            'field_ids.*' => 'required|integer|exists:custom_fields,id',
        ]);

        foreach ($validated['field_ids'] as $order => $fieldId) {
            $fieldGroup->fields()->where('id', $fieldId)->update(['order' => $order]);
        }

        return back();
    }
}
