#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> [1/2] Installing frontend dependencies and building production bundle..."
if command -v npm &> /dev/null; then
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "Notice: npm not found in build environment; using pre-bundled frontend assets in frontend/dist."
fi

echo ">>> [2/2] Installing Python backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ">>> RythuSahayam Full-Stack Build Succeeded!"
