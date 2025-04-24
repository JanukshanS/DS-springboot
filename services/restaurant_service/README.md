# Restaurant Service API Documentation

The Restaurant Service is responsible for managing restaurants, menu items, and customer reviews in the food delivery platform. It provides RESTful APIs for creating, reading, updating, and deleting restaurant data.

## Base URL

```
http://localhost:8082/api
```

## Authentication

Most endpoints are publicly accessible for reading restaurant information. Management operations (create, update, delete) should be protected with JWT authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Restaurant Endpoints

#### Get All Active Restaurants

Retrieves a list of all active restaurants.

- **URL**: `/restaurants`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of restaurant objects

#### Get All Restaurants (Including Inactive)

Retrieves a list of all restaurants, including inactive ones.

- **URL**: `/restaurants/all`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of restaurant objects

#### Get Restaurant by ID

Retrieves a specific restaurant by its ID.

- **URL**: `/restaurants/{id}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `id=[long]` - ID of the restaurant
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Restaurant object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {id}" }`

#### Create Restaurant

Creates a new restaurant.

- **URL**: `/restaurants`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**: Restaurant object
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: Created restaurant object

#### Update Restaurant

Updates an existing restaurant.

- **URL**: `/restaurants/{id}`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the restaurant
- **Request Body**: Restaurant object
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Updated restaurant object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {id}" }`

#### Delete Restaurant

Soft-deletes a restaurant (marks it as inactive).

- **URL**: `/restaurants/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the restaurant
- **Success Response**: 
  - **Code**: 204 No Content
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {id}" }`

#### Search Restaurants by Name

Searches for restaurants by name.

- **URL**: `/restaurants/search`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**: `name=[string]` - Name to search for
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of matching restaurant objects

#### Get Restaurants by Cuisine Type

Retrieves restaurants by cuisine type.

- **URL**: `/restaurants/cuisine/{cuisineType}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `cuisineType=[string]` - Type of cuisine
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of restaurant objects

#### Get All Cuisine Types

Retrieves all available cuisine types.

- **URL**: `/restaurants/cuisines`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of cuisine type strings

### Menu Item Endpoints

#### Get All Menu Items

Retrieves all menu items across all restaurants.

- **URL**: `/menu-items`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of menu item objects

#### Get Menu Item by ID

Retrieves a specific menu item by its ID.

- **URL**: `/menu-items/{id}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `id=[long]` - ID of the menu item
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Menu item object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Menu item not found with id: {id}" }`

#### Get Available Menu Items by Restaurant

Retrieves available menu items for a specific restaurant.

- **URL**: `/menu-items/restaurant/{restaurantId}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `restaurantId=[long]` - ID of the restaurant
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of menu item objects
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Get All Menu Items by Restaurant

Retrieves all menu items for a specific restaurant, including unavailable items.

- **URL**: `/menu-items/restaurant/{restaurantId}/all`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Parameters**: `restaurantId=[long]` - ID of the restaurant
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of menu item objects
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Get Menu Items by Category

Retrieves menu items for a specific restaurant and category.

- **URL**: `/menu-items/restaurant/{restaurantId}/category/{category}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: 
  - `restaurantId=[long]` - ID of the restaurant
  - `category=[string]` - Category of menu items
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of menu item objects
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Get Menu Items by Dietary Requirements

Retrieves menu items based on dietary requirements.

- **URL**: `/menu-items/restaurant/{restaurantId}/dietary`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `restaurantId=[long]` - ID of the restaurant
- **Query Parameters**: 
  - `vegetarian=[boolean]` - Filter for vegetarian items
  - `vegan=[boolean]` - Filter for vegan items
  - `glutenFree=[boolean]` - Filter for gluten-free items
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of menu item objects
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Create Menu Item

Creates a new menu item.

- **URL**: `/menu-items`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**: Menu item object
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: Created menu item object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Update Menu Item

Updates an existing menu item.

- **URL**: `/menu-items/{id}`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the menu item
- **Request Body**: Menu item object
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Updated menu item object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Menu item not found with id: {id}" }`

#### Delete Menu Item

Deletes a menu item.

- **URL**: `/menu-items/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the menu item
- **Success Response**: 
  - **Code**: 204 No Content
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Menu item not found with id: {id}" }`

#### Set Menu Item Availability

Updates the availability status of a menu item.

- **URL**: `/menu-items/{id}/availability`
- **Method**: `PATCH`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the menu item
- **Query Parameters**: `available=[boolean]` - Availability status
- **Success Response**: 
  - **Code**: 204 No Content
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Menu item not found with id: {id}" }`

### Review Endpoints

#### Get All Reviews

Retrieves all reviews across all restaurants.

- **URL**: `/reviews`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of review objects

#### Get Review by ID

Retrieves a specific review by its ID.

- **URL**: `/reviews/{id}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `id=[long]` - ID of the review
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Review object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Review not found with id: {id}" }`

#### Get Reviews by Restaurant

Retrieves reviews for a specific restaurant.

- **URL**: `/reviews/restaurant/{restaurantId}`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `restaurantId=[long]` - ID of the restaurant
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of review objects
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Get Reviews by Restaurant (Sorted)

Retrieves reviews for a specific restaurant, sorted by creation date (newest first).

- **URL**: `/reviews/restaurant/{restaurantId}/sorted`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `restaurantId=[long]` - ID of the restaurant
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of review objects (sorted)
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Get Reviews by User

Retrieves reviews created by a specific user.

- **URL**: `/reviews/user/{userId}`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Parameters**: `userId=[long]` - ID of the user
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of review objects

#### Get Reviews by Rating

Retrieves reviews for a restaurant that have a rating higher than or equal to the specified minimum.

- **URL**: `/reviews/restaurant/{restaurantId}/rating`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `restaurantId=[long]` - ID of the restaurant
- **Query Parameters**: `minRating=[integer]` - Minimum rating (1-5)
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of review objects
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Create Review

Creates a new review for a restaurant.

- **URL**: `/reviews`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**: Review object
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: Created review object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Restaurant not found with id: {restaurantId}" }`

#### Update Review

Updates an existing review.

- **URL**: `/reviews/{id}`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the review
- **Request Body**: Review object
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Updated review object
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Review not found with id: {id}" }`

#### Delete Review

Deletes a review.

- **URL**: `/reviews/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `id=[long]` - ID of the review
- **Success Response**: 
  - **Code**: 204 No Content
- **Error Response**: 
  - **Code**: 404 Not Found
  - **Content**: `{ "message": "Review not found with id: {id}" }`

## Data Models

### Restaurant

```json
{
  "id": 1,
  "name": "Pizza Paradise",
  "address": "123 Main St, Cityville",
  "phoneNumber": "555-123-4567",
  "email": "contact@pizzaparadise.com",
  "description": "Authentic Italian pizzas and more",
  "cuisineType": "Italian",
  "openingHours": "Mon-Sun: 10:00 AM - 10:00 PM",
  "imageUrl": "https://example.com/images/pizza-paradise.jpg",
  "isActive": true,
  "averageRating": 4.5,
  "menuItems": [],
  "reviews": []
}
```

### Menu Item

```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato, mozzarella, and basil",
  "price": 12.99,
  "category": "Pizza",
  "imageUrl": "https://example.com/images/margherita.jpg",
  "isAvailable": true,
  "isVegetarian": true,
  "isVegan": false,
  "isGlutenFree": false,
  "restaurantId": 1
}
```

### Review

```json
{
  "id": 1,
  "userId": 101,
  "userName": "John Doe",
  "rating": 5,
  "comment": "Excellent food and service!",
  "createdAt": "2025-04-25T14:30:00",
  "restaurantId": 1
}
```

## Error Responses

All endpoints can return the following error responses:

### Not Found (404)

```json
{
  "timestamp": "2025-04-27T12:00:00",
  "message": "Resource not found with id: {id}",
  "status": 404
}
```

### Internal Server Error (500)

```json
{
  "timestamp": "2025-04-27T12:00:00",
  "message": "An unexpected error occurred",
  "status": 500,
  "error": "Error details"
}
```

## Rate Limiting

The API has rate limiting enabled to prevent abuse. Clients are limited to 100 requests per minute per IP address. If you exceed this limit, you will receive a 429 Too Many Requests response.

## Contact

For any questions or issues regarding the Restaurant Service API, please contact the development team at dev@fooddeliveryplatform.com.

<!-- Refactor structure -->


<!-- Improve formatting -->


<!-- Update configuration -->


<!-- Enhance readability -->
