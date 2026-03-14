#!/bin/bash

# DebuggerMind Production Build Script
# Creates optimized production build and generates reports

set -e

echo "🏗️  DebuggerMind - Production Build"
echo "================================="
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
echo "✅ Cleaned .next directory"
echo ""

# Type check
echo "🔍 Running TypeScript type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Error: TypeScript errors found"
    echo "   Please fix type errors before building"
    exit 1
fi

echo "✅ Type check passed"
echo ""

# Lint check
echo "🔍 Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: ESLint errors found"
    echo "   Consider fixing them for better code quality"
    echo ""
fi

# Build
echo "📦 Building production bundle..."
echo "   This may take a few minutes..."
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""

# Show build info
echo "📊 Build Information:"
echo "   Next.js build output is in .next directory"
echo "   Static files are optimized and ready for deployment"
echo ""

# Check build size
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "   Build size: $BUILD_SIZE"
echo ""

echo "🚀 Ready for deployment!"
echo ""
echo "   To test production build locally:"
echo "   npm start"
echo ""
echo "   To deploy, follow instructions in deployment/ folder"
echo ""
