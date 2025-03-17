#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd backend
uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
