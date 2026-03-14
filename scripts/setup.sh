#!/bin/bash

# DebuggerMind Setup Script
# This script automates the initial setup process

set -e

echo "🛍️  DebuggerMind - Automated Setup Script"
echo "========================================"
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    echo "   Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  IMPORTANT: Please update .env.local with your actual values"
    echo ""
else
    echo "ℹ️  .env.local already exists, skipping..."
    echo ""
fi

# Run type check
echo "🔍 Running TypeScript type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: TypeScript errors found"
    echo "   Please fix them before deployment"
    echo ""
else
    echo "✅ No TypeScript errors found"
    echo ""
fi

# Run linting
echo "🔍 Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: ESLint errors found"
    echo "   Run 'npm run lint:fix' to auto-fix some issues"
    echo ""
else
    echo "✅ No linting errors found"
    echo ""
fi

echo "🎉 Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env.local with your API URLs"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see DOCUMENTATION.html"
echo ""
