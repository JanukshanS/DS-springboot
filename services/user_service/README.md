# User Service API Documentation

This service handles user management for the Food Delivery Platform, including authentication, registration, and user profile management.

## Base URL

```
http://localhost:8081/api
```

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### Register a new user
- **URL**: `/auth/signup`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "username": "john.doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER", // CUSTOMER, RESTAURANT_ADMIN, DELIVERY_PERSONNEL, SYSTEM_ADMIN
    "address": "123 Main St, City, Country"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER",
    "address": "123 Main St, City, Country",
    "enabled": true
  }
  ```
- **Error Response**: `400 Bad Request` if username/email already exists

#### User Login
- **URL**: `/auth/signin`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "usernameOrEmail": "john.doe",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER"
  }
  ```
- **Error Response**: `401 Unauthorized` if credentials are invalid

### User Management

#### Get Current User Profile
- **URL**: `/users/me`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER",
    "address": "123 Main St, City, Country",
    "enabled": true
  }
  ```

#### Get User by ID
- **URL**: `/users/{id}`
- **Method**: `GET`
- **Auth required**: Yes (Admin or own profile)
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER",
    "address": "123 Main St, City, Country",
    "enabled": true
  }
  ```
- **Error Response**: `404 Not Found` if user doesn't exist

#### Update User Profile
- **URL**: `/users/{id}`
- **Method**: `PUT`
- **Auth required**: Yes (Admin or own profile)
- **Request body**:
  ```json
  {
    "fullName": "John Smith",
    "phoneNumber": "+1987654321",
    "email": "john.smith@example.com",
    "address": "456 Oak St, City, Country"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "john.doe",
    "email": "john.smith@example.com",
    "fullName": "John Smith",
    "phoneNumber": "+1987654321",
    "role": "CUSTOMER",
    "address": "456 Oak St, City, Country",
    "enabled": true
  }
  ```

#### Change Password
- **URL**: `/users/{id}/password`
- **Method**: `PUT`
- **Auth required**: Yes (Admin or own profile)
- **Request body**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Password changed successfully"
  }
  ```
- **Error Response**: `400 Bad Request` if passwords don't match or current password is incorrect

#### Delete User
- **URL**: `/users/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin only)
- **Success Response**: `200 OK`
  ```json
  "User deleted successfully"
  ```

### Delivery Personnel Management

#### Get All Delivery Personnel
- **URL**: `/users/delivery-personnel`
- **Method**: `GET`
- **Auth required**: Yes (Admin or Restaurant Admin)
- **Success Response**: `200 OK` (Array of user objects)

#### Get Available Delivery Personnel
- **URL**: `/users/delivery-personnel/available`
- **Method**: `GET`
- **Auth required**: Yes (Admin or Restaurant Admin)
- **Success Response**: `200 OK` (Array of user objects)

#### Update Delivery Personnel Availability
- **URL**: `/users/delivery-personnel/{id}/availability?available=true`
- **Method**: `PUT`
- **Auth required**: Yes (Admin or own profile)
- **Success Response**: `200 OK` (Updated user object)

#### Update Delivery Personnel Location
- **URL**: `/users/delivery-personnel/{id}/location?location=37.7749,-122.4194`
- **Method**: `PUT`
- **Auth required**: Yes (Admin or own profile)
- **Success Response**: `200 OK` (Updated user object)

### Health Check

#### Service Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "service": "user-service",
    "status": "up",
    "timestamp": 1682674291527
  }
  ```

## Error Responses

All API endpoints return standard HTTP status codes:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication failed or token is missing
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

## Database Configuration

The service uses PostgreSQL database with the following configuration:

```
spring.datasource.url=jdbc:postgresql://db.lebinrutevacnawumxjg.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
```

## Running the Service

To start the service:

```bash
cd /path/to/user_service
./mvnw spring-boot:run
```

The service will start on port 8081.

<!-- Optimize performance -->


<!-- Fix style issues -->
