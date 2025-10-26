<?php

namespace App\Http\Controllers;

use App\Models\FieldGroup;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FormSubmissionController extends Controller
{
    public function index(FieldGroup $fieldGroup): Response
    {
        $submissions = $fieldGroup->submissions()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('ACF/Submissions/Index', [
            'fieldGroup' => $fieldGroup->load('fields'),
            'submissions' => $submissions,
        ]);
    }

    public function show(FieldGroup $fieldGroup, FormSubmission $submission): Response
    {
        if ($submission->field_group_id !== $fieldGroup->id) {
            abort(404);
        }

        // Resolve model field names
        $modelFieldData = [];
        foreach ($fieldGroup->fields as $field) {
            if ($field->type === 'model' && $field->model_type && isset($submission->data[$field->key])) {
                $modelId = is_array($submission->data[$field->key]) 
                    ? $submission->data[$field->key][0] 
                    : $submission->data[$field->key];
                
                if ($modelId) {
                    $modelClass = $this->resolveModelClass($field->model_type);
                    $model = $modelClass::find($modelId);
                    
                    if ($model) {
                        $modelFieldData[$field->key] = [
                            'id' => $model->id,
                            'name' => $model->name ?? $model->title ?? 'Item #' . $model->id,
                            'type' => $field->model_type,
                        ];
                    }
                }
            }
        }

        return Inertia::render('ACF/Submissions/Show', [
            'fieldGroup' => $fieldGroup->load('fields'),
            'submission' => $submission,
            'modelFieldData' => $modelFieldData,
        ]);
    }

    private function resolveModelClass(string $model): string
    {
        $modelClass = "App\\Models\\" . $model;
        
        if (!class_exists($modelClass)) {
            abort(404, 'Model not found');
        }

        return $modelClass;
    }

    public function destroy(FieldGroup $fieldGroup, FormSubmission $submission)
    {
        if ($submission->field_group_id !== $fieldGroup->id) {
            abort(404);
        }

        $submission->delete();

        return redirect()->route('field-groups.submissions.index', $fieldGroup)
            ->with('success', 'Submission deleted successfully.');
    }

    public function export(FieldGroup $fieldGroup)
    {
        $submissions = $fieldGroup->submissions()->with('fieldGroup.fields')->get();

        $csvData = [];
        $headers = ['ID', 'Submitted At', 'IP Address'];

        // Add field labels as headers
        foreach ($fieldGroup->fields as $field) {
            $headers[] = $field->label;
        }

        $csvData[] = $headers;

        // Add submission data
        foreach ($submissions as $submission) {
            $row = [
                $submission->id,
                $submission->created_at->format('Y-m-d H:i:s'),
                $submission->ip_address,
            ];

            foreach ($fieldGroup->fields as $field) {
                $value = $submission->data[$field->key] ?? '';
                if (is_array($value)) {
                    $value = implode(', ', $value);
                }
                $row[] = $value;
            }

            $csvData[] = $row;
        }

        $filename = 'submissions-' . $fieldGroup->key . '-' . now()->format('Y-m-d') . '.csv';

        $handle = fopen('php://output', 'w');
        ob_start();

        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
        $csv = ob_get_clean();

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
