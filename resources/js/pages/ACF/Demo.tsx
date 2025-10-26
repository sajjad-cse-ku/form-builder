import { CustomFieldsForm } from '@/components/ACF/CustomFieldsForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Field Groups', href: '/field-groups' },
  { title: 'Demo', href: '/acf/demo' },
];

export default function Demo({ user }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="ACF Demo" />
      <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/field-groups">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Field Groups
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-4">ACF Demo</h1>
        <p className="text-muted-foreground">
          Example of using custom fields with the User model
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="text-base">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd className="text-base">{user.email}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>
          <CustomFieldsForm model="User" entityId={user.id} />
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
