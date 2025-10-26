import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Globe } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  country: string;
  website: string;
  review_url: string;
}

interface Props {
  brands: Brand[];
}

export default function Index({ brands }: Props) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Brands</h1>
        <p className="text-muted-foreground">
          Explore brands and share your reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{brand.name}</CardTitle>
                <Badge variant="outline">{brand.country}</Badge>
              </div>
              <CardDescription>{brand.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    {brand.website}
                  </a>
                )}
                <div className="flex gap-2">
                  <Link href={`/brands/${brand.slug}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <a
                    href={brand.review_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Write Review
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
