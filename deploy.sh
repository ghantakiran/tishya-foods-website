#!/bin/bash

echo "🚀 Deploying Tishya Foods Website to Vercel..."
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project directory."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Ensure dependencies are installed
echo "📦 Installing dependencies..."
npm install

# Run build to check for errors
echo "🔨 Running production build test..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful! Ready for deployment."
echo ""
echo "🌐 Now run the following commands:"
echo ""
echo "1. Login to Vercel (if not already logged in):"
echo "   vercel login"
echo ""
echo "2. Deploy to Vercel:"
echo "   vercel"
echo ""
echo "3. For production deployment:"
echo "   vercel --prod"
echo ""
echo "📋 Deployment Configuration:"
echo "   - Framework: Next.js 15.3.4"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Install Command: npm install"
echo ""
echo "🔧 Environment Variables to set in Vercel Dashboard:"
echo "   - DATABASE_URL (if using database)"
echo "   - NEXTAUTH_SECRET (for authentication)"
echo "   - Any API keys you need"
echo ""
echo "📊 Expected Performance:"
echo "   - First Load JS: ~155kB"
echo "   - Total Pages: 8 pages"
echo "   - Build Time: < 5 seconds"
echo ""

# Optionally start the deployment process
read -p "🚀 Would you like to start the deployment now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting Vercel deployment..."
    vercel
else
    echo "Deployment preparation complete. Run 'vercel' when ready to deploy."
fi