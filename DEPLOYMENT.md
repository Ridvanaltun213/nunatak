# Deployment Guide

This guide explains how to deploy the Ideasoft Country-specific Pricing project to your Linux server.

## Prerequisites

- A Linux or macOS machine with bash shell
- `zip` command installed (`sudo apt-get install zip` or `sudo yum install zip`)
- Internet connection

## Deployment Steps

1. Make sure you're in the project's root directory

2. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

4. The script will:
   - Install any necessary dependencies (like sshpass)
   - Create a zip archive of the project
   - Transfer files to your remote server
   - Install Node.js, MySQL, and other required software
   - Configure MySQL with a secure database user
   - Set up the backend with PM2 for process management
   - Build the frontend React application
   - Configure Nginx to serve the application

5. When completed, you'll see connection information in the console:
   - Backend API URL
   - Admin panel URL
   - MySQL database credentials

## Manual Deployment Alternative

If the automated script doesn't work for your environment, follow these manual steps:

1. SSH into your server:
   ```bash
   ssh root@138.199.158.118
   ```

2. Install required software:
   ```bash
   apt-get update
   apt-get install -y nodejs npm mysql-server nginx
   ```

3. Set up MySQL:
   ```bash
   systemctl enable mysql
   systemctl start mysql
   mysql -e "CREATE DATABASE country_pricing;"
   mysql -e "CREATE USER 'ideasoft_admin'@'localhost' IDENTIFIED BY 'IdeasoftPrice2024!';"
   mysql -e "GRANT ALL PRIVILEGES ON country_pricing.* TO 'ideasoft_admin'@'localhost';"
   mysql -e "FLUSH PRIVILEGES;"
   ```

4. Copy the project to your server using scp or git

5. Configure backend:
   ```bash
   cd /path/to/project/backend
   npm install
   # Create .env file with database credentials
   ```

6. Configure and build frontend:
   ```bash
   cd /path/to/project/frontend
   npm install
   npm run build
   ```

7. Set up PM2 and Nginx as described in the deploy.sh script

## Troubleshooting

- **SSH Connection Issues**: Make sure your server allows SSH connections and that the credentials are correct
- **MySQL Errors**: If MySQL setup fails, you may need to run `mysql_secure_installation` manually
- **Node.js Version**: This project requires Node.js 14+. Run `node -v` to check your version
- **Port Conflicts**: Make sure ports 80 (Nginx) and 5000 (API) are available
- **Firewall Issues**: You may need to allow HTTP traffic with `ufw allow 80`

For additional help, refer to the project's README.md file or contact support. 