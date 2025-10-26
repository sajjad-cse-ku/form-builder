<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class FieldGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'key',
        'description',
        'location',
        'position',
        'active',
    ];

    protected $casts = [
        'location' => 'array',
        'active' => 'boolean',
    ];

    public function fields(): HasMany
    {
        return $this->hasMany(CustomField::class)->orderBy('order');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }

    protected function publicUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('form.public', ['key' => $this->key]),
        );
    }
}
