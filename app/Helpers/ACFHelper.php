<?php

namespace App\Helpers;

use App\Models\CustomField;
use App\Models\FieldGroup;
use Illuminate\Database\Eloquent\Model;

class ACFHelper
{
    /**
     * Get all field groups with their fields
     */
    public static function getFieldGroups(bool $activeOnly = true): \Illuminate\Database\Eloquent\Collection
    {
        $query = FieldGroup::with(['fields' => function ($query) {
            $query->orderBy('order');
        }])->orderBy('position');

        if ($activeOnly) {
            $query->where('active', true);
        }

        return $query->get();
    }

    /**
     * Get a specific field group by key
     */
    public static function getFieldGroup(string $key): ?FieldGroup
    {
        return FieldGroup::where('key', $key)
            ->with(['fields' => function ($query) {
                $query->orderBy('order');
            }])
            ->first();
    }

    /**
     * Get a specific field by key
     */
    public static function getField(string $key): ?CustomField
    {
        return CustomField::where('key', $key)->first();
    }

    /**
     * Get all custom fields for a model instance
     */
    public static function getFieldValues(Model $model): array
    {
        if (!method_exists($model, 'getAllCustomFields')) {
            return [];
        }

        return $model->getAllCustomFields();
    }

    /**
     * Get a single custom field value for a model instance
     */
    public static function getFieldValue(Model $model, string $fieldKey)
    {
        if (!method_exists($model, 'getCustomField')) {
            return null;
        }

        return $model->getCustomField($fieldKey);
    }

    /**
     * Set a custom field value for a model instance
     */
    public static function setFieldValue(Model $model, string $fieldKey, $value): void
    {
        if (!method_exists($model, 'setCustomField')) {
            throw new \Exception('Model does not support custom fields. Add HasCustomFields trait.');
        }

        $model->setCustomField($fieldKey, $value);
    }

    /**
     * Set multiple custom field values for a model instance
     */
    public static function setFieldValues(Model $model, array $values): void
    {
        foreach ($values as $fieldKey => $value) {
            self::setFieldValue($model, $fieldKey, $value);
        }
    }

    /**
     * Get formatted field value (for display purposes)
     */
    public static function getFormattedFieldValue(Model $model, string $fieldKey): string
    {
        $value = self::getFieldValue($model, $fieldKey);
        
        if (empty($value)) {
            return '';
        }

        $field = self::getField($fieldKey);
        
        if (!$field) {
            return is_array($value) ? implode(', ', $value) : (string) $value;
        }

        // Handle different field types
        switch ($field->type) {
            case 'select':
            case 'radio':
            case 'checkbox':
                if ($field->choices) {
                    $labels = [];
                    foreach ((array) $value as $val) {
                        $labels[] = $field->choices[$val] ?? $val;
                    }
                    return implode(', ', $labels);
                }
                break;

            case 'true_false':
                return ($value[0] === true || $value[0] === 'true') ? 'Yes' : 'No';

            case 'date':
                if (!empty($value[0])) {
                    return date('M d, Y', strtotime($value[0]));
                }
                break;

            case 'datetime':
                if (!empty($value[0])) {
                    return date('M d, Y g:i A', strtotime($value[0]));
                }
                break;

            case 'url':
                if (!empty($value[0])) {
                    return '<a href="' . htmlspecialchars($value[0]) . '" target="_blank">' . htmlspecialchars($value[0]) . '</a>';
                }
                break;

            case 'email':
                if (!empty($value[0])) {
                    return '<a href="mailto:' . htmlspecialchars($value[0]) . '">' . htmlspecialchars($value[0]) . '</a>';
                }
                break;
        }

        return is_array($value) ? implode(', ', $value) : (string) $value;
    }

    /**
     * Check if a field group exists
     */
    public static function fieldGroupExists(string $key): bool
    {
        return FieldGroup::where('key', $key)->exists();
    }

    /**
     * Check if a field exists
     */
    public static function fieldExists(string $key): bool
    {
        return CustomField::where('key', $key)->exists();
    }

    /**
     * Delete all field values for a model instance
     */
    public static function deleteFieldValues(Model $model): void
    {
        if (method_exists($model, 'fieldValues')) {
            $model->fieldValues()->delete();
        }
    }

    /**
     * Clone field values from one model instance to another
     */
    public static function cloneFieldValues(Model $source, Model $target): void
    {
        if (!method_exists($source, 'getAllCustomFields') || !method_exists($target, 'setCustomField')) {
            throw new \Exception('Models do not support custom fields.');
        }

        $values = $source->getAllCustomFields();
        
        foreach ($values as $fieldKey => $value) {
            $target->setCustomField($fieldKey, $value);
        }
    }
}
