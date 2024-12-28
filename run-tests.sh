#!/bin/bash

# Check if newman is installed, if not install it
if ! command -v newman &> /dev/null; then
    echo "Newman is not installed. Installing newman..."
    npm install -g newman
    
    # Check if installation was successful
    if ! command -v newman &> /dev/null; then
        echo "Failed to install newman. Please install Node.js and npm first."
        echo "Run: sudo apt-get install nodejs npm  # For Ubuntu/Debian"
        echo "Or visit: https://nodejs.org/en/download/"
        exit 1
    fi
fi

echo "Starting containers..."
docker-compose up -d

echo "Waiting for application to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:3000/health > /dev/null; then
        echo "Application is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "Application failed to start after $max_attempts attempts"
        docker-compose logs
        docker-compose down
        exit 1
    fi
    
    echo "Waiting for application to start... (Attempt $attempt/$max_attempts)"
    sleep 2
    attempt=$((attempt + 1))
done

echo "Running Postman tests..."
newman run collection.json -e environment.json

if [ "$1" == "--down" ]; then
    echo "Stopping containers..."
    docker-compose down
fi
