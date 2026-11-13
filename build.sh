#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> [1/2] Building React Frontend with Vite..."
cd frontend
npm install
npm run build
cd ..

echo ">>> [2/2] Installing Python Backend Requirements..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo ">>> RythuSahayam Build Completed Successfully!"
