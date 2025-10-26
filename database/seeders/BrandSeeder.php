<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Apple',
                'slug' => 'apple',
                'description' => 'Premium technology products and services',
                'website' => 'https://www.apple.com',
                'country' => 'USA',
                'active' => true,
            ],
            [
                'name' => 'Samsung',
                'slug' => 'samsung',
                'description' => 'Electronics and technology leader',
                'website' => 'https://www.samsung.com',
                'country' => 'South Korea',
                'active' => true,
            ],
            [
                'name' => 'Nike',
                'slug' => 'nike',
                'description' => 'Sports apparel and equipment',
                'website' => 'https://www.nike.com',
                'country' => 'USA',
                'active' => true,
            ],
            [
                'name' => 'Adidas',
                'slug' => 'adidas',
                'description' => 'Sportswear and athletic shoes',
                'website' => 'https://www.adidas.com',
                'country' => 'Germany',
                'active' => true,
            ],
            [
                'name' => 'Sony',
                'slug' => 'sony',
                'description' => 'Consumer electronics and entertainment',
                'website' => 'https://www.sony.com',
                'country' => 'Japan',
                'active' => true,
            ],
            [
                'name' => 'Microsoft',
                'slug' => 'microsoft',
                'description' => 'Software, hardware, and cloud services',
                'website' => 'https://www.microsoft.com',
                'country' => 'USA',
                'active' => true,
            ],
            [
                'name' => 'Dell',
                'slug' => 'dell',
                'description' => 'Computers and technology solutions',
                'website' => 'https://www.dell.com',
                'country' => 'USA',
                'active' => true,
            ],
            [
                'name' => 'HP',
                'slug' => 'hp',
                'description' => 'Computing and printing solutions',
                'website' => 'https://www.hp.com',
                'country' => 'USA',
                'active' => true,
            ],
            [
                'name' => 'IKEA',
                'slug' => 'ikea',
                'description' => 'Affordable furniture and home accessories',
                'website' => 'https://www.ikea.com',
                'country' => 'Sweden',
                'active' => true,
            ],
            [
                'name' => 'Zara',
                'slug' => 'zara',
                'description' => 'Fashion and clothing retailer',
                'website' => 'https://www.zara.com',
                'country' => 'Spain',
                'active' => true,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }

        $this->command->info('Brands seeded successfully!');
    }
}
