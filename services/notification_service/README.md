# Notification Service

This microservice handles the notification functionality for the food delivery application, including in-app notifications and email notifications.

## Features

- Create notifications for users
- Retrieve notifications (all, unread, by type)
- Mark notifications as read (single or all)
- Get unread notification count
- Email notification support
- JWT authentication aligned with User Service

## Tech Stack

- Java 21
- Spring Boot 3.4.5
- Spring Security with JWT Authentication
- Spring Data JPA
- PostgreSQL Database
- Spring Mail for email notifications
- Swagger/OpenAPI for API documentation

## API Documentation

When the service is running, Swagger UI is available at:
```
http://localhost:8084/swagger-ui/index.html
```

## API Endpoints

### Public Endpoints (No Authentication Required)

- `POST /api/public/notifications` - Create a notification (for service-to-service communication)
- `GET /health` - Health check endpoint

### Protected Endpoints (Authentication Required)

- `GET /api/notifications` - Get all notifications for authenticated user
- `GET /api/notifications/unread` - Get unread notifications
- `GET /api/notifications/unread/count` - Get count of unread notifications
- `GET /api/notifications/type/{type}` - Get notifications by type
- `PUT /api/notifications/{id}/read` - Mark a notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## Configuration

Configuration is stored in `application.properties`:

- Database configuration
- JWT authentication settings
- Email server configuration

## Email Configuration

To enable email notifications, set the following environment variables:
```
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Building and Running

### Prerequisites
- Java 21
- Maven

### Build
```bash
mvn clean package
```

### Run
```bash
mvn spring-boot:run
```

Or with specific environment variables:
```bash
EMAIL_USERNAME=your-email@gmail.com EMAIL_PASSWORD=your-app-password mvn spring-boot:run
```

## Docker Support

Build the Docker image:
```bash
docker build -t notification-service .
```

Run as a Docker container:
```bash
docker run -p 8084:8084 --name notification-service \
  -e EMAIL_USERNAME=your-email@gmail.com \
  -e EMAIL_PASSWORD=your-app-password \
  notification-service
```