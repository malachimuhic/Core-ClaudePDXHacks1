#!/bin/bash
# FixIt Bot — Start all services
# Run from project root: bash integration/run-all.sh

set -e

echo "=== FixIt Bot — Starting All Services ==="
echo ""

# Check for .env
if [ ! -f backend/.env ]; then
  echo "ERROR: backend/.env not found!"
  echo "Run: cp backend/.env.example backend/.env"
  echo "Then add your ANTHROPIC_API_KEY"
  exit 1
fi

# Install dependencies if needed
if [ ! -d backend/node_modules ]; then
  echo "Installing backend dependencies..."
  (cd backend && npm install)
fi

if [ ! -d frontend/node_modules ]; then
  echo "Installing frontend dependencies..."
  (cd frontend && npm install)
fi

if [ ! -d ai-service/node_modules ]; then
  echo "Installing ai-service dependencies..."
  (cd ai-service && npm install)
fi

echo ""
echo "Starting backend on http://localhost:3001 ..."
(cd backend && node server.js) &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "=== Both services running ==="
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both."

# Trap Ctrl+C to kill both processes
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# Wait for either to exit
wait
