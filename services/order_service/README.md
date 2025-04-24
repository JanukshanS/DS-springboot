# Order Service

The Order Service is responsible for managing orders in the Food Delivery Platform. It provides endpoints for creating orders, tracking order status, cancelling orders, and managing delivery assignments.

## Features

- Create new orders
- Track order status
- Update order status
- Assign delivery personnel
- View orders by user, restaurant, or status
- Cancel orders
- Manage payment information

## Technologies

- Java 21
- Spring Boot 3.4.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Lombok
- JUnit 5

## Setup Instructions

1. Clone the repository
2. Configure the database connection in `src/main/resources/application.properties`
3. Build the project: `./mvnw clean install`
4. Run the service: `./mvnw spring-boot:run`

## API Endpoints

### Order Management

- `POST /api/orders` - Create a new order
- `GET /api/orders/{orderId}` - Get order by ID
- `GET /api/orders/user` - Get current user's orders
- `GET /api/orders/restaurant/{restaurantId}` - Get orders by restaurant ID
- `PUT /api/orders/{orderId}/status` - Update order status
- `PUT /api/orders/{orderId}/delivery-personnel/{deliveryPersonnelId}` - Assign delivery personnel
- `GET /api/orders/status/{status}` - Get orders by status
- `GET /api/orders/delivery-personnel` - Get orders assigned to delivery personnel
- `PUT /api/orders/{orderId}/payment` - Update payment information
- `PUT /api/orders/{orderId}/cancel` - Cancel an order

## Authentication

All endpoints except health checks require JWT authentication. The JWT token should be included in the Authorization header with the Bearer scheme.

<!-- Optimize performance -->


<!-- Optimize performance -->


<!-- Add details -->


<!-- Update configuration -->
