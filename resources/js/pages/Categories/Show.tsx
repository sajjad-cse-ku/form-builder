import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  feedback_url: string;
}

interface Props {
  category: Category;
}

const breadcrumbs = (category: Category): BreadcrumbItem[] => [
  { title: 'Categories', href: '/categories' },
  { title: category.name, href: `/categories/${category.slug}` },
];

export default function Show({ category }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs(category)}>
      <Head title={category.name} />
      <div className="container mx-auto py-8">
      <Link href="/categories">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </Link>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{category.name}</CardTitle>
            <CardDescription className="text-lg">
              {category.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Share Your Feedback
                </h3>
                <p className="text-muted-foreground mb-4">
                  Help us improve by sharing your thoughts about the{' '}
                  {category.name} category. Your feedback is valuable to us!
                </p>
                <a
                  href={category.feedback_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Open Feedback Form
                  </Button>
                </a>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">How it works</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Click the "Open Feedback Form" button above</li>
                  <li>Fill out the feedback form for {category.name}</li>
                  <li>Submit your responses</li>
                  <li>We'll review your feedback and improve our service</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}
