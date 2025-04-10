#!/bin/bash

# Country-specific Pricing for Ideasoft Deployment Script
# This script deploys the project to a Linux server with MySQL

# Server details
SERVER_IP="138.199.158.118"
SERVER_USER="root"
SERVER_PASSWORD="Yega2828"
PROJECT_DIR="/opt/ideasoft-country-pricing"

# MySQL database configuration
DB_NAME="country_pricing"
DB_USER="ideasoft_admin"
DB_PASSWORD="IdeasoftPrice2024!"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Ideasoft Country-specific Pricing Project${NC}"
echo -e "${YELLOW}====================================================${NC}"

# Create a production zip file
echo -e "${GREEN}Creating project archive...${NC}"
zip -r ideasoft-country-pricing.zip . -x "node_modules/*" "*/node_modules/*" ".git/*" "deploy.sh"

# Install sshpass if not already installed
echo -e "${GREEN}Checking if sshpass is installed...${NC}"
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}Installing sshpass...${NC}"
    sudo apt-get update
    sudo apt-get install -y sshpass
fi

# Deploy to server
echo -e "${GREEN}Deploying to server ${SERVER_IP}...${NC}"
sshpass -p "${SERVER_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "mkdir -p ${PROJECT_DIR}"
sshpass -p "${SERVER_PASSWORD}" scp ideasoft-country-pricing.zip ${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}/

# Setup on the server
echo -e "${GREEN}Setting up the project on the server...${NC}"
sshpass -p "${SERVER_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << EOF
  # Update system and install dependencies
  apt-get update
  apt-get install -y nodejs npm mysql-server unzip

  # Setup MySQL
  echo -e "${GREEN}Setting up MySQL...${NC}"
  systemctl enable mysql
  systemctl start mysql
  
  # Create database and user
  mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
  mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
  mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
  mysql -e "FLUSH PRIVILEGES;"
  
  # Setup project
  echo -e "${GREEN}Extracting project files...${NC}"
  cd ${PROJECT_DIR}
  unzip -o ideasoft-country-pricing.zip
  
  # Setup backend
  echo -e "${GREEN}Setting up backend...${NC}"
  cd ${PROJECT_DIR}/backend
  npm install
  
  # Create .env file
  cat > .env << ENVFILE
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 32)
ENVFILE
  
  # Setup frontend
  echo -e "${GREEN}Building frontend...${NC}"
  cd ${PROJECT_DIR}/frontend
  npm install
  npm run build
  
  # Install PM2 for process management
  echo -e "${GREEN}Setting up PM2...${NC}"
  npm install -g pm2
  
  # Start backend with PM2
  cd ${PROJECT_DIR}/backend
  pm2 start src/index.js --name "ideasoft-country-pricing"
  pm2 save
  pm2 startup
  
  # Setup Nginx for frontend if needed
  echo -e "${GREEN}Setting up Nginx...${NC}"
  apt-get install -y nginx
  
  # Create Nginx configuration
  cat > /etc/nginx/sites-available/ideasoft-country-pricing << NGINXCONF
server {
    listen 80;
    server_name ${SERVER_IP};

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend
    location / {
        root ${PROJECT_DIR}/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
NGINXCONF

  # Enable site and restart Nginx
  ln -sf /etc/nginx/sites-available/ideasoft-country-pricing /etc/nginx/sites-enabled/
  nginx -t && systemctl restart nginx
  
  echo -e "${GREEN}Deployment completed!${NC}"
  echo -e "${GREEN}Backend API is running at: http://${SERVER_IP}/api${NC}"
  echo -e "${GREEN}Admin panel is available at: http://${SERVER_IP}/${NC}"
EOF

# Cleanup
echo -e "${GREEN}Cleaning up...${NC}"
rm ideasoft-country-pricing.zip

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}====================================================${NC}"
echo -e "${GREEN}Backend API is running at: http://${SERVER_IP}/api${NC}"
echo -e "${GREEN}Admin panel is available at: http://${SERVER_IP}/${NC}"
echo -e "${YELLOW}MySQL database: ${DB_NAME}${NC}"
echo -e "${YELLOW}MySQL user: ${DB_USER}${NC}"
echo -e "${YELLOW}MySQL password: ${DB_PASSWORD}${NC}"
echo -e "${YELLOW}====================================================${NC}" 