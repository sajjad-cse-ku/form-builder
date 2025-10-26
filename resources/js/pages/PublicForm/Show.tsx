import { FieldGroup } from '@/types/acf';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldRenderer } from '@/components/ACF/FieldRenderer';
import { CheckCircle } from 'lucide-react';

interface ModelOption {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  fieldGroup: FieldGroup;
  fieldModelOptions?: Record<string, ModelOption[]>;
}

export default function Show({ fieldGroup, fieldModelOptions }: Props) {
  const [submitted, setSubmitted] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    data: {} as Record<string, any>,
  });

  const handleFieldChange = (key: string, value: any) => {
    setData('data', {
      ...data.data,
      [key]: value,
    });
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};
    fieldGroup.fields.forEach((field) => {
      if (
        field.required &&
        (!data.data[field.key] || data.data[field.key].length === 0)
      ) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    post(`/form/${fieldGroup.key}/submit`, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground text-lg">
              Your submission has been received successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-2">{fieldGroup.title}</CardTitle>
            {fieldGroup.description && (
              <CardDescription className="text-base">
                {fieldGroup.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {fieldGroup.fields.map((field) => (
                <div key={field.id}>
                  <FieldRenderer
                    field={field}
                    value={data.data[field.key]}
                    onChange={handleFieldChange}
                    error={errors[`data.${field.key}`]}
                    modelOptions={field.type === 'model' ? fieldModelOptions?.[field.key] : undefined}
                  />
                </div>
              ))}

              <div className="pt-4">
                <Button type="submit" disabled={processing} className="w-full">
                  {processing ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Powered by ACF Form Builder</p>
        </div>
      </div>
    </div>
  );
}
