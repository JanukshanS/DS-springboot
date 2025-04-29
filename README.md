# Food Delivery Platform - Deployment Guide

This document provides instructions for deploying the Food Delivery Platform, a microservices-based application.

## System Architecture

The platform consists of the following microservices:

- **User Service** (Port: 8081) - User management and authentication
- **Restaurant Service** (Port: 8082) - Restaurant and menu management
- **Order Service** (Port: 8083) - Order processing
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
