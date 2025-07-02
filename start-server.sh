#!/bin/bash

echo "🚀 Starting Tishya Foods Website..."
echo "=================================="

# Kill any existing processes on port 3000
echo "Stopping any existing servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the development server
echo "Starting development server..."
npm run dev &

# Wait a moment for server to start
sleep 3

echo ""
echo "✅ Tishya Foods Website is now running!"
echo ""
echo "🌐 Local URL:    http://localhost:3000"
echo "📱 Network URL:  http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📋 Available Pages:"
echo "   🏠 Homepage:     http://localhost:3000"
echo "   🛍️  Products:     http://localhost:3000/products"
echo "   ℹ️  About:        http://localhost:3000/about"
echo "   👨‍🍳 Recipes:      http://localhost:3000/recipes"
echo "   📞 Contact:      http://localhost:3000/contact"
echo ""
echo "⏹️  To stop the server, press Ctrl+C"
echo ""

# Keep the script running
wait