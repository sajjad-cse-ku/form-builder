import { FieldGroup, CustomField } from '@/types/acf';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Submission {
  id: number;
  field_group_id: number;
  data: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface ModelFieldData {
  id: number;
  name: string;
  type: string;
}

interface Props {
  fieldGroup: FieldGroup;
  submission: Submission;
  modelFieldData?: Record<string, ModelFieldData>;
}

const breadcrumbs = (fieldGroup: FieldGroup, submissionId: number): BreadcrumbItem[] => [
  { title: 'Field Groups', href: '/field-groups' },
  { title: fieldGroup.title, href: `/field-groups/${fieldGroup.id}/edit` },
  { title: 'Submissions', href: `/field-groups/${fieldGroup.id}/submissions` },
  { title: `Submission #${submissionId}`, href: '' },
];

export default function Show({ fieldGroup, submission, modelFieldData }: Props) {
  const getFieldValue = (field: CustomField) => {
    const value = submission.data[field.key];

    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    // Handle different field types
    switch (field.type) {
      case 'select':
      case 'radio':
      case 'checkbox':
        if (field.choices) {
          const values = Array.isArray(value) ? value : [value];
          return values
            .map((v) => field.choices![v] || v)
            .join(', ');
        }
        return Array.isArray(value) ? value.join(', ') : value;

      case 'true_false':
        return value[0] === true || value[0] === 'true' ? 'Yes' : 'No';

      case 'date':
        return value[0]
          ? new Date(value[0]).toLocaleDateString()
          : value;

      case 'datetime':
        return value[0]
          ? new Date(value[0]).toLocaleString()
          : value;

      case 'url':
        return (
          <a
            href={value[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {value[0]}
          </a>
        );

      case 'email':
        return (
          <a href={`mailto:${value[0]}`} className="text-blue-600 hover:underline">
            {value[0]}
          </a>
        );

      case 'model':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return <span className="text-muted-foreground italic">Not selected</span>;
        }
        const modelData = modelFieldData?.[field.key];
        if (modelData) {
          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium">{modelData.name}</span>
              <span className="text-xs text-muted-foreground">
                {modelData.type} (ID: {modelData.id})
              </span>
            </div>
          );
        }
        const modelId = Array.isArray(value) ? value[0] : value;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{field.model_type}</span>
            <span className="text-muted-foreground">ID: {modelId}</span>
          </div>
        );

      default:
        return Array.isArray(value) ? value.join(', ') : value;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(fieldGroup, submission.id)}>
      <Head title={`Submission #${submission.id}`} />
      <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href={`/field-groups/${fieldGroup.id}/submissions`}>
          <Button variant="ghost" size="sm" className="mb-4">
            ← Back to Submissions
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Submission #{submission.id}</h1>
        <p className="text-muted-foreground">
          Submitted on {new Date(submission.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Submission Data */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
            <CardDescription>Form responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldGroup.fields.map((field) => (
              <div
                key={field.id}
                className="pb-4 border-b last:border-b-0 last:pb-0"
              >
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <div className="text-base">{getFieldValue(field)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Metadata</CardTitle>
            <CardDescription>Technical information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                IP Address
              </label>
              <p className="text-base">
                <code>{submission.ip_address}</code>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                User Agent
              </label>
              <p className="text-sm text-muted-foreground break-all">
                {submission.user_agent}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Submitted At
              </label>
              <p className="text-base">
                {new Date(submission.created_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}
