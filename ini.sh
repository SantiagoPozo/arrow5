#!/bin/bash

# Start backend server in new terminal
gnome-terminal -- bash -c "
echo 'Starting backend server...';
cd backend;
uvicorn main:app --reload;
exec bash" &

# Start frontend server in new terminal
gnome-terminal -- bash -c "
echo 'Starting frontend server...';
cd frontend;
npm run dev;
exec bash" &

