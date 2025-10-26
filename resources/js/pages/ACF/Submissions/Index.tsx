import { FieldGroup } from '@/types/acf';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Eye, Trash2, Download, ExternalLink, Copy, CheckCircle } from 'lucide-react';
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
import { useState } from 'react';

interface Submission {
  id: number;
  field_group_id: number;
  data: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface Props {
  fieldGroup: FieldGroup;
  submissions: {
    data: Submission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const breadcrumbs = (fieldGroup: FieldGroup): BreadcrumbItem[] => [
  { title: 'Field Groups', href: '/field-groups' },
  { title: fieldGroup.title, href: `/field-groups/${fieldGroup.id}/edit` },
  { title: 'Submissions', href: `/field-groups/${fieldGroup.id}/submissions` },
];

export default function Index({ fieldGroup, submissions }: Props) {
  const [copied, setCopied] = useState(false);

  const handleDelete = (submissionId: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      router.delete(`/field-groups/${fieldGroup.id}/submissions/${submissionId}`);
    }
  };

  const handleExport = () => {
    window.location.href = `/field-groups/${fieldGroup.id}/submissions/export`;
  };

  const publicUrl = window.location.origin + `/form/${fieldGroup.key}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(fieldGroup)}>
      <Head title={`${fieldGroup.title} - Submissions`} />
      <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/field-groups">
          <Button variant="ghost" size="sm" className="mb-4">
            ← Back to Field Groups
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{fieldGroup.title} - Submissions</h1>
        <p className="text-muted-foreground">
          View and manage form submissions
        </p>
      </div>

      {/* Public Form Link */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Public Form Link
          </CardTitle>
          <CardDescription>
            Share this link to collect submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={publicUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-white"
            />
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Form
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                Total: {submissions.total} submissions
              </CardDescription>
            </div>
            {submissions.total > 0 && (
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {submissions.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No submissions yet
              </p>
              <p className="text-sm text-muted-foreground">
                Share your form link to start collecting submissions
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.data.map((submission) => {
                  // Get first few field values for preview
                  const previewFields = fieldGroup.fields
                    .slice(0, 2)
                    .map((field) => {
                      const value = submission.data[field.key];
                      return `${field.label}: ${Array.isArray(value) ? value.join(', ') : value || 'N/A'}`;
                    })
                    .join(' | ');

                  return (
                    <TableRow key={submission.id}>
                      <TableCell>#{submission.id}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {previewFields}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">{submission.ip_address}</code>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/field-groups/${fieldGroup.id}/submissions/${submission.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(submission.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}
