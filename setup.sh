#!/bin/bash

echo "🚀 Setting up SkillTrust Frontend..."

# Clean install
echo "📦 Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install specific packages
echo "📦 Installing additional packages..."
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @headlessui/react @heroicons/react
npm install react-hook-form @hookform/resolvers zod
npm install axios react-hot-toast
npm install jwt-decode

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p src/app/auth/login
mkdir -p src/app/auth/register
mkdir -p src/app/dashboard/user/dashboard
mkdir -p src/components/ui
mkdir -p src/lib/hooks
mkdir -p src/lib/api
mkdir -p src/types

echo "✅ Setup complete! Starting development server..."
npm run dev