#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Setting up the virtual environment..."

# Check if the venv directory already exists
if [ -d "venv" ]; then
    echo "Virtual environment 'venv' already exists. Skipping creation."
else
    # Create the virtual environment
    python3 -m venv venv
    echo "Created virtual environment."
fi

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip (optional but recommended)
pip install --upgrade pip

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
else
    echo "Warning: requirements.txt not found. No packages installed."
fi

echo "Setup complete! To activate the environment, run:"
echo "source venv/bin/activate"
