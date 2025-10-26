@echo off
echo ========================================
echo ACF System Installation
echo ========================================
echo.

echo Step 1: Running migrations...
php artisan migrate
echo.

echo Step 2: Seeding example data...
choice /C YN /M "Would you like to seed example field groups"
if errorlevel 2 goto skipSeed
php artisan db:seed --class=ACFExampleSeeder
:skipSeed
echo.

echo Step 3: Building assets...
call npm run build
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start your server: php artisan serve
echo 2. Visit /field-groups to manage fields
echo 3. Visit /acf-demo to see the demo
echo.
echo Documentation:
echo - ACF_COMPLETE.md - Quick overview
echo - ACF_SETUP.md - Setup guide
echo - ACF_README.md - Full documentation
echo - EXAMPLES.md - Code examples
echo.
pause
