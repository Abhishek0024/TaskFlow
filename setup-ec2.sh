#!/bin/bash
# setup-ec2.sh
# Run this script with sudo on a fresh Ubuntu EC2 instance

set -e

echo "Updating packages..."
apt update && apt upgrade -y

echo "Installing Java 17 (Temurin/OpenJDK)..."
apt install -y openjdk-17-jdk

echo "Installing Node.js (v20)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "Installing Maven..."
apt install -y maven

echo "Installing Nginx..."
apt install -y nginx

echo "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

echo "Configuring PostgreSQL..."
# Create the taskflow database and update the postgres user password
sudo -u postgres psql -c "CREATE DATABASE taskflow;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Admin';"

echo "========================================="
echo "Setup Complete!"
echo "Node Version: $(node -v)"
echo "Java Version: $(java -version)"
echo "Next Steps:"
echo "1. Clone your repository into /home/ubuntu/TaskFlow if you haven't already."
echo "2. Create a .env file in the root of the project with your environment variables."
echo "3. Copy taskflow-frontend/nginx.conf to /etc/nginx/sites-available/default and restart Nginx."
echo "4. Copy taskflow-backend/taskflow-backend.service to /etc/systemd/system/ and enable it."
echo "5. Run deploy.sh to build and start the application."
echo "========================================="
