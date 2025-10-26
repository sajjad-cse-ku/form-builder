import { FieldGroup, FieldValues } from '@/types/acf';
import React, { useEffect, useState } from 'react';
import { FieldRenderer } from './FieldRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface CustomFieldsFormProps {
  model: string;
  entityId?: number;
  initialValues?: FieldValues;
  onSubmit?: (values: FieldValues) => void;
  readonly?: boolean;
}

export const CustomFieldsForm: React.FC<CustomFieldsFormProps> = ({
  model,
  entityId,
  initialValues = {},
  onSubmit,
  readonly = false,
}) => {
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>([]);
  const [values, setValues] = useState<FieldValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFields();
  }, [model, entityId]);

  const loadFields = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/acf/fields', {
        model,
        entity_id: entityId,
      });

      setFieldGroups(response.data.fieldGroups);
      if (response.data.values) {
        setValues({ ...initialValues, ...response.data.values });
      }
    } catch (error) {
      console.error('Failed to load fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    fieldGroups.forEach((group) => {
      group.fields.forEach((field) => {
        if (field.required && (!values[field.key] || values[field.key].length === 0)) {
          newErrors[field.key] = `${field.label} is required`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    if (onSubmit) {
      onSubmit(values);
      return;
    }

    // Default save behavior
    if (!entityId) {
      console.error('Entity ID is required to save');
      return;
    }

    try {
      setSaving(true);
      await axios.post('/api/acf/values', {
        model,
        entity_id: entityId,
        values,
      });
      alert('Saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save fields');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading fields...</div>;
  }

  if (fieldGroups.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">
        No custom fields configured for this model.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fieldGroups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            {group.description && (
              <CardDescription>{group.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {group.fields.map((field) => (
              <div
                key={field.id}
                style={{
                  width: field.wrapper?.width || '100%',
                }}
                className={field.wrapper?.class}
              >
                <FieldRenderer
                  field={field}
                  value={values[field.key]}
                  onChange={handleFieldChange}
                  error={errors[field.key]}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {!readonly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Fields'}
          </Button>
        </div>
      )}
    </form>
  );
};
