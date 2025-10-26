<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schools = [
            [
                'name' => 'Greenwood High School',
                'code' => 'GHS001',
                'address' => '123 Main Street',
                'city' => 'Springfield',
                'state' => 'Illinois',
                'phone' => '555-0100',
                'email' => 'info@greenwood.edu',
                'principal' => 'Dr. Sarah Johnson',
                'active' => true,
            ],
            [
                'name' => 'Riverside Academy',
                'code' => 'RA002',
                'address' => '456 River Road',
                'city' => 'Portland',
                'state' => 'Oregon',
                'phone' => '555-0200',
                'email' => 'admissions@riverside.edu',
                'principal' => 'Mr. Michael Chen',
                'active' => true,
            ],
            [
                'name' => 'Lakeside Elementary',
                'code' => 'LE003',
                'address' => '789 Lake Avenue',
                'city' => 'Seattle',
                'state' => 'Washington',
                'phone' => '555-0300',
                'email' => 'office@lakeside.edu',
                'principal' => 'Mrs. Emily Rodriguez',
                'active' => true,
            ],
            [
                'name' => 'Oakwood International School',
                'code' => 'OIS004',
                'address' => '321 Oak Street',
                'city' => 'Boston',
                'state' => 'Massachusetts',
                'phone' => '555-0400',
                'email' => 'admin@oakwood.edu',
                'principal' => 'Dr. James Wilson',
                'active' => true,
            ],
            [
                'name' => 'Sunrise Montessori School',
                'code' => 'SMS005',
                'address' => '654 Sunrise Boulevard',
                'city' => 'Austin',
                'state' => 'Texas',
                'phone' => '555-0500',
                'email' => 'contact@sunrisemontessori.edu',
                'principal' => 'Ms. Patricia Lee',
                'active' => true,
            ],
        ];

        foreach ($schools as $schoolData) {
            $school = School::create($schoolData);

            // Create classes for each school
            $this->createClassesForSchool($school);
        }

        $this->command->info('Schools and Classes seeded successfully!');
    }

    private function createClassesForSchool(School $school): void
    {
        $grades = [
            ['grade' => 'Kindergarten', 'sections' => ['A', 'B']],
            ['grade' => '1st Grade', 'sections' => ['A', 'B', 'C']],
            ['grade' => '2nd Grade', 'sections' => ['A', 'B', 'C']],
            ['grade' => '3rd Grade', 'sections' => ['A', 'B']],
            ['grade' => '4th Grade', 'sections' => ['A', 'B']],
            ['grade' => '5th Grade', 'sections' => ['A', 'B']],
        ];

        $teachers = [
            'Ms. Anderson',
            'Mr. Brown',
            'Mrs. Davis',
            'Mr. Garcia',
            'Ms. Martinez',
            'Mrs. Miller',
            'Mr. Moore',
            'Ms. Taylor',
            'Mr. Thomas',
            'Mrs. White',
        ];

        foreach ($grades as $gradeData) {
            foreach ($gradeData['sections'] as $section) {
                SchoolClass::create([
                    'school_id' => $school->id,
                    'name' => $gradeData['grade'] . ' - Section ' . $section,
                    'grade' => $gradeData['grade'],
                    'section' => $section,
                    'teacher' => $teachers[array_rand($teachers)],
                    'room_number' => rand(100, 500),
                    'capacity' => rand(25, 35),
                    'active' => true,
                ]);
            }
        }
    }
}
