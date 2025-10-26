<?php

namespace App\Models\Traits;

use App\Models\FieldValue;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasCustomFields
{
    public function fieldValues(): MorphMany
    {
        return $this->morphMany(FieldValue::class, 'entity');
    }

    public function getCustomField(string $fieldKey)
    {
        $fieldValue = $this->fieldValues()
            ->whereHas('customField', function ($query) use ($fieldKey) {
                $query->where('key', $fieldKey);
            })
            ->with('customField')
            ->first();

        return $fieldValue?->value;
    }

    public function setCustomField(string $fieldKey, $value): void
    {
        $customField = \App\Models\CustomField::where('key', $fieldKey)->first();

        if (!$customField) {
            throw new \Exception("Custom field with key '{$fieldKey}' not found");
        }

        $this->fieldValues()->updateOrCreate(
            ['custom_field_id' => $customField->id],
            ['value' => is_array($value) ? $value : [$value]]
        );
    }

    public function getAllCustomFields(): array
    {
        $fieldValues = $this->fieldValues()->with('customField')->get();

        $result = [];
        foreach ($fieldValues as $fieldValue) {
            $result[$fieldValue->customField->key] = $fieldValue->value;
        }

        return $result;
    }
}
