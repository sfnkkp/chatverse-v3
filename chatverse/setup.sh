#!/bin/bash

# ChatVerse Setup Script
# This script helps you set up ChatVerse quickly

echo "========================================="
echo "   ChatVerse - Quick Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Create .env file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Create .env.local file
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created frontend/.env.local"
else
    echo "⚠️  frontend/.env.local already exists"
fi

# Install dependencies
echo "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Success message
echo ""
echo "========================================="
echo "   🎉 Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Admin panel:"
echo "   http://localhost:3000/admin"
echo "   Username: admin"
echo "   Password: chatverse2025"
echo ""
echo "📖 For more information, read:"
echo "   - README.md (complete guide)"
echo "   - QUICKSTART.md (quick start)"
echo "   - DEPLOYMENT.md (production deployment)"
echo ""
echo "Happy chatting! 🚀"
