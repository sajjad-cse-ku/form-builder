import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Field Groups', href: '/field-groups' },
  { title: 'Create', href: '/field-groups/create' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    key: '',
    description: '',
    position: 0,
    active: true,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/field-groups');
  };

  const generateKey = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Field Group" />
      <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Field Group</h1>
        <p className="text-muted-foreground">
          Add a new custom field group to your application
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Field Group Details</CardTitle>
            <CardDescription>
              Configure the basic settings for your field group
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => {
                  setData('title', e.target.value);
                  if (!data.key) {
                    setData('key', generateKey(e.target.value));
                  }
                }}
                placeholder="e.g., Product Details"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                value={data.key}
                onChange={(e) => setData('key', e.target.value)}
                placeholder="e.g., product_details"
              />
              <p className="text-sm text-muted-foreground">
                Unique identifier for this field group (lowercase, underscores
                only)
              </p>
              {errors.key && (
                <p className="text-sm text-red-500">{errors.key}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Describe what this field group is for..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                value={data.position}
                onChange={(e) => setData('position', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Display order (lower numbers appear first)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={data.active}
                onCheckedChange={(checked) =>
                  setData('active', checked as boolean)
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? 'Creating...' : 'Create Field Group'}
          </Button>
        </div>
      </form>
    </div>
    </AppLayout>
  );
}
