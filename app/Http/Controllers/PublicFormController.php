<?php

namespace App\Http\Controllers;

use App\Models\FieldGroup;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicFormController extends Controller
{
    public function show(string $key, Request $request): Response
    {
        $fieldGroup = FieldGroup::where('key', $key)
            ->where('active', true)
            ->with(['fields' => function ($query) {
                $query->orderBy('order');
            }])
            ->firstOrFail();

        // Get model options for individual model type fields
        $fieldModelOptions = [];
        foreach ($fieldGroup->fields as $field) {
            if ($field->type === 'model' && $field->model_type) {
                $modelClass = $this->resolveModelClass($field->model_type);
                $fieldModelOptions[$field->key] = $modelClass::where('active', true)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name ?? $item->title ?? 'Item #' . $item->id,
                        'description' => $item->description ?? null,
                    ];
                });
            }
        }

        return Inertia::render('PublicForm/Show', [
            'fieldGroup' => $fieldGroup,
            'fieldModelOptions' => $fieldModelOptions,
        ]);
    }

    public function submit(Request $request, string $key)
    {
        $fieldGroup = FieldGroup::where('key', $key)
            ->where('active', true)
            ->with('fields')
            ->firstOrFail();

        // Validate required fields
        $rules = [];
        foreach ($fieldGroup->fields as $field) {
            if ($field->required) {
                $rules['data.' . $field->key] = 'required';
            }
        }

        $validated = $request->validate($rules);

        // Prepare submission data
        $submissionData = [
            'field_group_id' => $fieldGroup->id,
            'data' => $request->data,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ];

        // Save submission
        $submission = FormSubmission::create($submissionData);

        return redirect()->back()->with('success', 'Thank you! Your submission has been received.');
    }

    private function resolveModelClass(string $model): string
    {
        $modelClass = "App\\Models\\" . $model;
        
        if (!class_exists($modelClass)) {
            abort(404, 'Model not found');
        }

        return $modelClass;
    }
}
