<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ExampleModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            BrandSeeder::class,
            SchoolSeeder::class,
        ]);

        $this->command->info('All example models seeded successfully!');
    }
}
