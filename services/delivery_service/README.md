# Delivery Service

The Delivery Service is responsible for managing delivery operations in the Food Delivery Platform. It provides APIs for creating, tracking, and managing deliveries.

## Features

- Create and manage deliveries
- Assign drivers to deliveries
- Track delivery status
- Update delivery information
- Filter deliveries by order, driver, or status
- JWT authentication aligned with User Service

## Tech Stack

- Java 21
- Spring Boot 3.4.5
- Spring Security with JWT Authentication
- Spring Data JPA
- PostgreSQL Database
- Swagger/OpenAPI for API documentation

## API Documentation

When the service is running, Swagger UI is available at:
```
http://localhost:8085/swagger-ui/index.html
```

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Create a new delivery
- `POST /api/deliveries`
- Requires authentication with ADMIN, RESTAURANT, or STAFF role

### Get delivery by ID
- `GET /api/deliveries/{id}`
- Requires authentication with ADMIN, DRIVER, RESTAURANT, CUSTOMER, or STAFF role

### Get deliveries by order ID
- `GET /api/deliveries/order/{orderId}`
- Requires authentication with ADMIN, DRIVER, RESTAURANT, CUSTOMER, or STAFF role

### Get deliveries by driver ID
- `GET /api/deliveries/driver/{driverId}`
- Requires authentication with ADMIN, DRIVER, or STAFF role

### Get deliveries by status
- `GET /api/deliveries/status/{status}`
- Requires authentication with ADMIN, DRIVER, RESTAURANT, or STAFF role

### Update a delivery
- `PUT /api/deliveries/{id}`
- Requires authentication with ADMIN, DRIVER, RESTAURANT, or STAFF role

### Update delivery status
- `PATCH /api/deliveries/{id}/status`
- Requires authentication with ADMIN, DRIVER, RESTAURANT, or STAFF role

### Assign a driver to delivery
- `PATCH /api/deliveries/{id}/assign`
- Requires authentication with ADMIN or STAFF role

### Delete a delivery
- `DELETE /api/deliveries/{id}`
- Requires authentication with ADMIN role

### Track delivery status (public endpoint)
- `GET /api/deliveries/public/tracking/{id}`
- No authentication required

### Get current driver's deliveries
- `GET /api/deliveries/my-deliveries`
- Requires authentication with DRIVER role

## Setup Instructions

1. Configure the database connection in `src/main/resources/application.properties`
2. Build the project: `./mvnw clean install`
3. Run the service: `./mvnw spring-boot:run`

## Integration with Other Services

The Delivery Service integrates with:

- User Service for authentication
- Order Service for order information
- Notification Service for delivery status updates

<!-- Improve formatting -->
