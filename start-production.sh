#!/bin/bash
# Production Deployment Script
# Run this to start both backend and frontend for production

echo "🚀 Starting Portfolio Production Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd server

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Run migrations
echo "🗄️  Running database migrations..."
npm run migrate

# Seed database with sample data (optional)
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "✅ Backend setup complete!"
echo ""

# Start backend in background
echo "🟢 Starting backend server..."
npm run dev &
BACKEND_PID=$!
echo "Backend running on PID: $BACKEND_PID"

sleep 2

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."
cd ../Portfolio/app

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🟢 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
echo "Frontend running on PID: $FRONTEND_PID"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Both servers are running!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for both processes
wait
