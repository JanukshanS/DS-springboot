# Frontend Data Transfer Objects (DTOs)

This directory contains Data Transfer Objects (DTOs) that match the backend service models. These DTOs help ensure that the data sent to and received from the backend services is properly structured.

## Auth DTOs

### LoginRequest

Matches the backend `LoginRequest.java` class used for user authentication.

```javascript
{
  usernameOrEmail: string, // Required
  password: string         // Required
}
```

### SignupRequest

Matches the backend `SignupRequest.java` class used for user registration.

```javascript
{
  username: string,       // Required
  email: string,          // Required
  password: string,       // Required
  fullName: string,       // Required
  phoneNumber: string,    // Optional
  role: string,           // Default: 'CUSTOMER'
  address: string,        // Optional
  available: boolean,     // For delivery personnel
  currentLocation: string, // For delivery personnel
  restaurantId: number    // For restaurant admin
}
```

### JwtResponse

Matches the backend `JwtResponse.java` class returned after successful authentication.

```javascript
{
  token: string,          // JWT token
  type: string,           // Default: 'Bearer'
  id: number,             // User ID
  username: string,       // Username
  email: string,          // Email
  role: string,           // User role
  accessToken: string,    // Access token (same as token)
  refreshToken: string    // Refresh token
}
```

## Usage

Import the DTOs in your components:

```javascript
import { LoginRequest, SignupRequest, JwtResponse } from '../models';
```

Create instances using the provided factory methods:

```javascript
// Create a login request
const loginRequest = LoginRequest.fromCredentials(email, password);

// Create a signup request
const signupRequest = SignupRequest.fromUserData(userData);

// Parse a JWT response
const jwtResponse = JwtResponse.fromResponse(response.data);
```

Validate the DTOs:

```javascript
const errors = loginRequest.validate();
if (Object.keys(errors).length === 0) {
  // No validation errors
}
```

Convert to other formats:

```javascript
// Get user object from JWT response
const user = jwtResponse.toUser();
```
