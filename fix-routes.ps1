Write-Host "🔧 Fixing Next.js routes..." -ForegroundColor Yellow

# Navigate to app directory
Set-Location "C:\projects\skills-platform\frontend\src\app"

# Remove problematic folders
Write-Host "Removing old folders..." -ForegroundColor Cyan
if (Test-Path "(auth)") {
    Remove-Item -Recurse -Force "(auth)"
    Write-Host "  ✅ Removed (auth)"
}
if (Test-Path "(dashboard)") {
    Remove-Item -Recurse -Force "(dashboard)"
    Write-Host "  ✅ Removed (dashboard)"
}

# Create new folders
Write-Host "Creating new folders..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "login" | Out-Null
New-Item -ItemType Directory -Force -Path "register" | Out-Null
New-Item -ItemType Directory -Force -Path "user\dashboard" | Out-Null

Write-Host "✅ Folder structure fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Now you need to:"
Write-Host "1. Copy your login page to: src\app\login\page.tsx"
Write-Host "2. Copy your register page to: src\app\register\page.tsx"
Write-Host "3. Restart the dev server: npm run dev"
Write-Host ""
Write-Host "Your routes will be available at:"
Write-Host "  📍 http://localhost:3000/login"
Write-Host "  📍 http://localhost:3000/register"