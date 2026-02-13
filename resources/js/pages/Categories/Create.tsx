import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
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
  { title: 'Categories', href: '/categories' },
  { title: 'Create', href: '/categories/create' },
];

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    slug: '',
    description: '',
    image: '',
    active: true,
  });
  const slugManuallyEdited = useRef(false);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/categories');
  };

  const handleNameChange = (value: string) => {
    setData('name', value);
    if (!slugManuallyEdited.current) {
      setData('slug', generateSlug(value));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Category" />
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create Category</h1>
          <p className="text-muted-foreground">
            Add a new category
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>
                Name, slug, and optional description and image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Electronics"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => {
                    slugManuallyEdited.current = true;
                    setData('slug', e.target.value);
                  }}
                  placeholder="e.g., electronics"
                />
                <p className="text-sm text-muted-foreground">
                  URL-friendly identifier (auto-generated from name if left empty)
                </p>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Describe this category..."
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image (path or URL)</Label>
                <Input
                  id="image"
                  value={data.image}
                  onChange={(e) => setData('image', e.target.value)}
                  placeholder="e.g., /images/category.jpg"
                />
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image}</p>
                )}
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
              {processing ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
