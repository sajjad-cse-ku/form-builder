import { FieldGroup, FieldValues } from '@/types/acf';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface UseCustomFieldsOptions {
  model: string;
  entityId?: number;
  autoLoad?: boolean;
}

interface UseCustomFieldsReturn {
  fieldGroups: FieldGroup[];
  values: FieldValues;
  loading: boolean;
  error: string | null;
  loadFields: () => Promise<void>;
  saveValues: (values: FieldValues) => Promise<void>;
  updateValue: (key: string, value: any) => void;
  resetValues: () => void;
}

export function useCustomFields({
  model,
  entityId,
  autoLoad = true,
}: UseCustomFieldsOptions): UseCustomFieldsReturn {
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>([]);
  const [values, setValues] = useState<FieldValues>({});
  const [initialValues, setInitialValues] = useState<FieldValues>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/acf/fields', {
        model,
        entity_id: entityId,
      });

      setFieldGroups(response.data.fieldGroups);
      setValues(response.data.values || {});
      setInitialValues(response.data.values || {});
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load fields';
      setError(errorMessage);
      console.error('Failed to load custom fields:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveValues = async (valuesToSave: FieldValues) => {
    if (!entityId) {
      throw new Error('Entity ID is required to save values');
    }

    try {
      setLoading(true);
      setError(null);

      await axios.post('/api/acf/values', {
        model,
        entity_id: entityId,
        values: valuesToSave,
      });

      setInitialValues(valuesToSave);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save values';
      setError(errorMessage);
      console.error('Failed to save custom field values:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateValue = (key: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetValues = () => {
    setValues(initialValues);
  };

  useEffect(() => {
    if (autoLoad) {
      loadFields();
    }
  }, [model, entityId, autoLoad]);

  return {
    fieldGroups,
    values,
    loading,
    error,
    loadFields,
    saveValues,
    updateValue,
    resetValues,
  };
}
