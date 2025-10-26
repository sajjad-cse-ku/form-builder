<?php

namespace Database\Seeders;

use App\Models\CustomField;
use App\Models\FieldGroup;
use Illuminate\Database\Seeder;

class ACFExampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create User Profile Field Group
        $userProfileGroup = FieldGroup::create([
            'title' => 'User Profile',
            'key' => 'user_profile',
            'description' => 'Additional user profile information',
            'position' => 0,
            'active' => true,
        ]);

        // Add fields to User Profile group
        CustomField::create([
            'field_group_id' => $userProfileGroup->id,
            'label' => 'Phone Number',
            'name' => 'phone_number',
            'key' => 'field_phone_number',
            'type' => 'text',
            'instructions' => 'Enter your contact phone number',
            'required' => false,
            'placeholder' => '+1 (555) 000-0000',
            'order' => 0,
        ]);

        CustomField::create([
            'field_group_id' => $userProfileGroup->id,
            'label' => 'Department',
            'name' => 'department',
            'key' => 'field_department',
            'type' => 'select',
            'instructions' => 'Select your department',
            'required' => true,
            'choices' => [
                'sales' => 'Sales Department',
                'marketing' => 'Marketing Department',
                'engineering' => 'Engineering Department',
                'hr' => 'Human Resources',
                'finance' => 'Finance',
            ],
            'multiple' => false,
            'order' => 1,
        ]);

        CustomField::create([
            'field_group_id' => $userProfileGroup->id,
            'label' => 'Skills',
            'name' => 'skills',
            'key' => 'field_skills',
            'type' => 'select',
            'instructions' => 'Select all skills that apply',
            'required' => false,
            'choices' => [
                'php' => 'PHP',
                'javascript' => 'JavaScript',
                'python' => 'Python',
                'java' => 'Java',
                'csharp' => 'C#',
                'react' => 'React',
                'vue' => 'Vue.js',
                'laravel' => 'Laravel',
            ],
            'multiple' => true,
            'order' => 2,
        ]);

        CustomField::create([
            'field_group_id' => $userProfileGroup->id,
            'label' => 'Bio',
            'name' => 'bio',
            'key' => 'field_bio',
            'type' => 'textarea',
            'instructions' => 'Tell us about yourself',
            'required' => false,
            'placeholder' => 'Write a short bio...',
            'order' => 3,
        ]);

        CustomField::create([
            'field_group_id' => $userProfileGroup->id,
            'label' => 'Available for Hire',
            'name' => 'available_for_hire',
            'key' => 'field_available_for_hire',
            'type' => 'true_false',
            'instructions' => 'Are you currently available for new opportunities?',
            'required' => false,
            'order' => 4,
        ]);

        CustomField::create([
            'field_group_id' => $userProfileGroup->id,
            'label' => 'Start Date',
            'name' => 'start_date',
            'key' => 'field_start_date',
            'type' => 'date',
            'instructions' => 'Your employment start date',
            'required' => false,
            'order' => 5,
        ]);

        // Create Product Details Field Group (example for e-commerce)
        $productGroup = FieldGroup::create([
            'title' => 'Product Details',
            'key' => 'product_details',
            'description' => 'Additional product specifications',
            'position' => 1,
            'active' => true,
        ]);

        CustomField::create([
            'field_group_id' => $productGroup->id,
            'label' => 'Color',
            'name' => 'color',
            'key' => 'field_color',
            'type' => 'select',
            'instructions' => 'Available colors',
            'required' => true,
            'choices' => [
                'black' => 'Black',
                'white' => 'White',
                'red' => 'Red',
                'blue' => 'Blue',
                'green' => 'Green',
                'yellow' => 'Yellow',
            ],
            'multiple' => false,
            'order' => 0,
        ]);

        CustomField::create([
            'field_group_id' => $productGroup->id,
            'label' => 'Sizes',
            'name' => 'sizes',
            'key' => 'field_sizes',
            'type' => 'checkbox',
            'instructions' => 'Available sizes',
            'required' => true,
            'choices' => [
                'xs' => 'Extra Small',
                's' => 'Small',
                'm' => 'Medium',
                'l' => 'Large',
                'xl' => 'Extra Large',
                'xxl' => 'XXL',
            ],
            'order' => 1,
        ]);

        CustomField::create([
            'field_group_id' => $productGroup->id,
            'label' => 'Material',
            'name' => 'material',
            'key' => 'field_material',
            'type' => 'radio',
            'instructions' => 'Primary material',
            'required' => false,
            'choices' => [
                'cotton' => 'Cotton',
                'polyester' => 'Polyester',
                'wool' => 'Wool',
                'silk' => 'Silk',
                'leather' => 'Leather',
            ],
            'order' => 2,
        ]);

        CustomField::create([
            'field_group_id' => $productGroup->id,
            'label' => 'Features',
            'name' => 'features',
            'key' => 'field_features',
            'type' => 'checkbox',
            'instructions' => 'Special features',
            'required' => false,
            'choices' => [
                'waterproof' => 'Waterproof',
                'organic' => 'Organic',
                'handmade' => 'Handmade',
                'eco_friendly' => 'Eco-Friendly',
                'limited_edition' => 'Limited Edition',
            ],
            'order' => 3,
        ]);

        CustomField::create([
            'field_group_id' => $productGroup->id,
            'label' => 'Weight (kg)',
            'name' => 'weight',
            'key' => 'field_weight',
            'type' => 'number',
            'instructions' => 'Product weight in kilograms',
            'required' => false,
            'placeholder' => '0.00',
            'order' => 4,
        ]);

        CustomField::create([
            'field_group_id' => $productGroup->id,
            'label' => 'Manufacturer Website',
            'name' => 'manufacturer_website',
            'key' => 'field_manufacturer_website',
            'type' => 'url',
            'instructions' => 'Link to manufacturer website',
            'required' => false,
            'placeholder' => 'https://example.com',
            'order' => 5,
        ]);

        $this->command->info('ACF example field groups and fields created successfully!');
    }
}
