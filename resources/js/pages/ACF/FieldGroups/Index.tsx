import { FieldGroup } from '@/types/acf';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, EditIcon, Trash2, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface FieldGroupWithStats extends FieldGroup {
  submissions_count: number;
  public_url: string;
}

interface Props {
  fieldGroups: FieldGroupWithStats[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Field Groups',
    href: '/field-groups',
  },
];

export default function Index({ fieldGroups }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this field group?')) {
      router.delete(`/field-groups/${id}`);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Field Groups" />
      <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Field Groups</h1>
          <p className="text-muted-foreground">
            Manage your custom field groups
          </p>
        </div>
        <Link href="/field-groups/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Field Group
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Field Groups</CardTitle>
          <CardDescription>
            Field groups contain custom fields that can be attached to different
            models
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fieldGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No field groups found. Create your first field group to get
              started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.title}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {group.key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {group.fields.length} fields
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/field-groups/${group.id}/submissions`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          {group.submissions_count} submissions
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={group.active ? 'default' : 'secondary'}>
                        {group.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/field-groups/${group.id}/submissions`}>
                          <Button variant="outline" size="sm" title="View Submissions">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                        <a href={group.public_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" title="Open Public Form">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                        <Link href={`/field-groups/${group.id}/edit`}>
                          <Button variant="outline" size="sm" title="Edit">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(group.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}
