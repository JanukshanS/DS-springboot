# Food Delivery Platform - Deployment Guide

This document provides instructions for deploying the Food Delivery Platform, a microservices-based application using Docker and Kubernetes.

## System Architecture

The platform consists of the following microservices:

- **Gateway Service** (Port: 8080) - API Gateway and routing
- **User Service** (Port: 8081) - User management and authentication
- **Restaurant Service** (Port: 8082) - Restaurant and menu management
- **Order Service** (Port: 8083) - Order processing
- **Payment Service** (Port: 8084) - Payment processing
- **Delivery Service** (Port: 8085) - Delivery management
- **Notification Service** (Port: 8086) - Notifications and alerts
- **Frontend** (Port: 80) - React-based user interface

## Deployment Options

You can deploy the application using either Docker Compose (for local development) or Kubernetes (for production).

### Docker Compose Deployment (Local Development)

1. Make sure you have Docker and Docker Compose installed on your machine.

2. Navigate to the root directory of the project and run:

   ```bash
   docker-compose up -d
   ```

3. The application will be available at:
   - Frontend: http://localhost
   - API Gateway: http://localhost:8080

4. To stop the application, run:

   ```bash
   docker-compose down
   ```

### Kubernetes Deployment (Production)

For production deployment on a VPS with 8GB RAM, follow these steps:

1. Make sure you have a VPS with at least 8GB RAM running Ubuntu.

2. Set up the VPS with Kubernetes using the provided script:

   ```bash
   cd scripts
   chmod +x setup-vps.sh
   ./setup-vps.sh --domain yourdomain.com --ip your.server.ip
   ```

3. Build and push Docker images:

   ```bash
   chmod +x build-images.sh
   ./build-images.sh [optional-registry-url]
   ```

4. Deploy the application to Kubernetes:

   ```bash
   chmod +x deploy-k8s.sh
   ./deploy-k8s.sh --domain yourdomain.com --ip your.server.ip
   ```

5. Configure your domain DNS settings to point to your server IP:
   - Add an A record for yourdomain.com pointing to your server IP
   - Add an A record for api.yourdomain.com pointing to your server IP

6. Wait for DNS propagation (can take up to 24-48 hours)

7. Access your application at:
   - Frontend: https://yourdomain.com
   - API Gateway: https://api.yourdomain.com
- **Payment Service** (Port: 8084) - Payment processing with Stripe integration
- **Notification Service** (Port: 8084) - In-app and email notifications
- **Delivery Service** (Port: 8085) - Delivery tracking and management
- **API Gateway** (Port: 8080) - Entry point for all client requests

## Prerequisites

- Java 21
- Maven
- Docker and Docker Compose
- PostgreSQL (or use the containerized version)
- Stripe account (for payment processing)

## Deployment Options

### Option 1: Local Development Deployment

1. Clone the repository
2. Configure database connections in each service's `application.properties` file
3. Start each service individually:

```bash
cd services/[service_name]
./mvnw spring-boot:run
```

4. Start the frontend:

```bash
cd frontend-v1
npm install
npm run dev
```

### Option 2: Docker Deployment

1. Build Docker images for each service:

```bash
# Example for one service
cd services/[service_name]
docker build -t [service_name]:latest .
```

2. Use Docker Compose to start all services:

```bash
docker-compose up -d
```

### Option 3: Kubernetes Deployment

1. Apply Kubernetes configurations:

```bash
kubectl apply -f kubernetes/deployments/
kubectl apply -f kubernetes/services/
kubectl apply -f kubernetes/configs/
```

## Environment Configuration

Each service requires specific environment variables:

### Database Configuration
Each service connects to its own PostgreSQL database. Configure connection details in the respective `application.properties` files.

### JWT Authentication
All services use a shared JWT secret for authentication. Ensure the same secret is configured across all services.

### Email Configuration (Notification Service)
To enable email notifications:
```
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Stripe Configuration (Payment Service)
For payment processing:
```
STRIPE_API_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## Health Checks

Each service provides a health endpoint at:
```
http://localhost:[port]/health
```

## API Documentation

Swagger UI is available for each service at:
```
http://localhost:[port]/swagger-ui/index.html
```

## Troubleshooting

- Check service logs for detailed error information
- Verify database connections and credentials
- Ensure all required environment variables are set
- Check network connectivity between services

## Security Notes

- Secure all database credentials and API keys
- Use HTTPS in production environments
- Regularly update dependencies and apply security patches


<!-- Optimize performance -->


<!-- Enhance readability -->
