<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomField extends Model
{
    use HasFactory;

    protected $fillable = [
        'field_group_id',
        'label',
        'name',
        'key',
        'type',
        'instructions',
        'required',
        'default_value',
        'placeholder',
        'choices',
        'multiple',
        'model_type',
        'conditional_logic',
        'wrapper',
        'order',
    ];

    protected $casts = [
        'required' => 'boolean',
        'multiple' => 'boolean',
        'default_value' => 'array',
        'choices' => 'array',
        'conditional_logic' => 'array',
        'wrapper' => 'array',
    ];

    public function fieldGroup(): BelongsTo
    {
        return $this->belongsTo(FieldGroup::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(FieldValue::class);
    }
}
