<?php

namespace App\Http\Controllers;

use App\Models\FieldGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FieldValueController extends Controller
{
    /**
     * Get all fields for a specific model and entity
     */
    public function getFields(Request $request)
    {
        $validated = $request->validate([
            'model' => 'required|string',
            'entity_id' => 'nullable|integer',
        ]);

        $modelClass = $this->resolveModelClass($validated['model']);
        
        // Get all active field groups
        $fieldGroups = FieldGroup::with(['fields' => function ($query) {
            $query->orderBy('order');
        }])
        ->where('active', true)
        ->orderBy('position')
        ->get();

        // If entity_id is provided, get existing values
        $existingValues = [];
        if (isset($validated['entity_id'])) {
            $entity = $modelClass::find($validated['entity_id']);
            if ($entity && method_exists($entity, 'fieldValues')) {
                $fieldValues = $entity->fieldValues()->with('customField')->get();
                foreach ($fieldValues as $fv) {
                    $existingValues[$fv->customField->key] = $fv->value;
                }
            }
        }

        return response()->json([
            'fieldGroups' => $fieldGroups,
            'values' => $existingValues,
        ]);
    }

    /**
     * Save field values for an entity
     */
    public function saveValues(Request $request)
    {
        $validated = $request->validate([
            'model' => 'required|string',
            'entity_id' => 'required|integer',
            'values' => 'required|array',
        ]);

        $modelClass = $this->resolveModelClass($validated['model']);
        $entity = $modelClass::findOrFail($validated['entity_id']);

        if (!method_exists($entity, 'fieldValues')) {
            return response()->json(['error' => 'Model does not support custom fields'], 422);
        }

        DB::transaction(function () use ($entity, $validated) {
            foreach ($validated['values'] as $fieldKey => $value) {
                $customField = \App\Models\CustomField::where('key', $fieldKey)->first();
                
                if ($customField) {
                    $entity->fieldValues()->updateOrCreate(
                        ['custom_field_id' => $customField->id],
                        ['value' => is_array($value) ? $value : [$value]]
                    );
                }
            }
        });

        return response()->json(['success' => true]);
    }

    /**
     * Resolve model class from string
     */
    private function resolveModelClass(string $model): string
    {
        $modelClass = "App\\Models\\" . $model;
        
        if (!class_exists($modelClass)) {
            abort(404, 'Model not found');
        }

        return $modelClass;
    }
}
