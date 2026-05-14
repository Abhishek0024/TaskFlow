#!/bin/bash
# deploy.sh
# Run this from the root of the TaskFlow project on the EC2 instance

set -e

echo "Starting Deployment Process..."

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo "Loaded environment variables from .env"
else
  echo "WARNING: .env file not found! Using default configuration."
fi

echo "Pulling latest changes from Git..."
git pull origin main || echo "Git pull failed or not a git repository. Proceeding with local files."

echo "Building Backend..."
cd taskflow-backend
mvn clean package -DskipTests
cd ..

echo "Building Frontend..."
cd taskflow-frontend
npm install
npm run build
cd ..

echo "Deploying Frontend to Nginx..."
sudo rm -rf /var/www/html/*
sudo cp -r taskflow-frontend/dist/* /var/www/html/

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Restarting Backend Service..."
sudo systemctl daemon-reload
sudo systemctl restart taskflow-backend

echo "Deployment completed successfully!"
