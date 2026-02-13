import { Head, useForm, Link } from '@inertiajs/react';
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
import { ArrowLeft } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
}

interface Props {
  category: Category;
}

const breadcrumbs = (category: Category): BreadcrumbItem[] => [
  { title: 'Categories', href: '/categories' },
  { title: category.name, href: `/categories/${category.id}/edit` },
];

export default function Edit({ category }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    image: category.image || '',
    active: category.active,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/categories/${category.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(category)}>
      <Head title={`Edit ${category.name}`} />
      <div className="container mx-auto py-8">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground">
            Update category details
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
                  onChange={(e) => setData('name', e.target.value)}
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
                  onChange={(e) => setData('slug', e.target.value)}
                  placeholder="e.g., electronics"
                />
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
            <Link href="/categories">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Category'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
