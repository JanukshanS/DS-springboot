# Payment Service API Documentation

## Overview

The Payment Service handles all payment processing for the Food Delivery Platform. It integrates with Stripe for secure payment processing and provides endpoints for creating payments, tracking payment status, and processing refunds.

## Base URL

```
http://localhost:8084/api
```

## Authentication

All endpoints except the Stripe webhook endpoint require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Payment Management

- `POST /api/payments` - Create a new payment
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/user` - Get current user's payments
- `GET /api/payments/order/{orderId}` - Get payments by order ID
- `PUT /api/payments/{id}/status` - Update payment status
- `POST /api/payments/{id}/refund` - Process a refund
- `POST /api/payments/webhook` - Handle Stripe webhook events

## Request & Response Examples

### Create a new payment

**Request:**

```json
POST /api/payments
{
  "orderId": 123,
  "amount": 25.99,
  "paymentMethod": "CREDIT_CARD",
  "stripeToken": "tok_visa",
  "description": "Payment for order #123"
}
```

**Response:**

```json
{
  "id": 1,
  "orderId": 123,
  "amount": 25.99,
  "status": "PENDING",
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "cb476c2a-b026-4a96-9d6e-6789f12345",
  "clientSecret": "pi_3Lsxyz_secret_ZDkBCde123456789",
  "createdAt": "2025-04-27T14:30:45",
  "updatedAt": "2025-04-27T14:30:45"
}
```

## Technologies

- Java 21
- Spring Boot 3.4.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Stripe API
- Lombok

## Setup Instructions

1. Clone the repository
2. Configure the database connection in `src/main/resources/application.properties`
3. Set up your Stripe API keys in `src/main/resources/application.properties`
4. Build the project: `./mvnw clean install`
5. Run the service: `./mvnw spring-boot:run`

## Stripe Integration

The service integrates with Stripe for payment processing. The payment flow is:

1. Client creates a payment intent through the API
2. Client uses the returned client secret to complete the payment on the frontend
3. Stripe sends a webhook notification upon payment completion
4. The service updates the payment status based on the webhook event

## Environment Variables

The following environment variables should be configured:

- `spring.datasource.url` - PostgreSQL database URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `stripe.api.key` - Stripe secret key
- `stripe.webhook.secret` - Stripe webhook signing secret