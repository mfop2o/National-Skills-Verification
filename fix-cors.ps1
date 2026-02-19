Write-Host "🔧 Fixing CORS issues..." -ForegroundColor Yellow

# Backend CORS configuration
$corsConfig = @'
<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
'@

# Write CORS config
$corsConfig | Out-File -FilePath "C:\projects\skills-platform\backend\config\cors.php" -Encoding UTF8 -Force
Write-Host "✅ Updated CORS configuration" -ForegroundColor Green

# Clear Laravel cache
Write-Host "🧹 Clearing Laravel cache..." -ForegroundColor Cyan
Set-Location "C:\projects\skills-platform\backend"
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Start Laravel server with CORS enabled
Write-Host ""
Write-Host "✅ CORS fix applied!" -ForegroundColor Green
Write-Host ""
Write-Host "Now restart both servers:" -ForegroundColor Yellow
Write-Host "1. Laravel: php artisan serve" -ForegroundColor White
Write-Host "2. Next.js: npm run dev" -ForegroundColor White