/**
 * Mock data service for development and testing
 * This provides mock data when the backend is not available
 */

// Mock restaurants
export const mockRestaurants = [
  {
    id: 1,
    name: "Burger Palace",
    description: "Delicious burgers and fries",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 2,
    name: "Pizza Heaven",
    description: "Authentic Italian pizza",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "25-40 min",
    deliveryFee: 3.99,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 3,
    name: "Sushi Express",
    description: "Fresh sushi and Japanese cuisine",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "35-50 min",
    deliveryFee: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 4,
    name: "Taco Fiesta",
    description: "Authentic Mexican tacos and burritos",
    cuisine: "Mexican",
    rating: 4.3,
    deliveryTime: "20-35 min",
    deliveryFee: 2.49,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 5,
    name: "Curry House",
    description: "Spicy Indian curries and naan",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "40-55 min",
    deliveryFee: 3.49,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Mock menu items for each restaurant
export const mockMenuItems = {
  1: [
    {
      id: 101,
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and special sauce",
      price: 8.99,
      category: "Burgers",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 102,
      name: "Cheeseburger",
      description: "Classic burger with American cheese",
      price: 9.99,
      category: "Burgers",
      imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 103,
      name: "French Fries",
      description: "Crispy golden fries",
      price: 3.99,
      category: "Sides",
      imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 104,
      name: "Onion Rings",
      description: "Crispy battered onion rings",
      price: 4.99,
      category: "Sides",
      imageUrl: "https://images.unsplash.com/photo-1581410288882-a32bd08cb388?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 105,
      name: "Chocolate Milkshake",
      description: "Rich and creamy chocolate milkshake",
      price: 5.99,
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  2: [
    {
      id: 201,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      category: "Pizzas",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 202,
      name: "Pepperoni Pizza",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 14.99,
      category: "Pizzas",
      imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 203,
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter",
      price: 4.99,
      category: "Sides",
      imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ]
};

// Mock orders
export const mockOrders = [
  {
    id: 1001,
    userId: 1,
    restaurantId: 1,
    restaurantName: "Burger Palace",
    items: [
      {
        id: 101,
        name: "Classic Burger",
        price: 8.99,
        quantity: 2
      },
      {
        id: 103,
        name: "French Fries",
        price: 3.99,
        quantity: 1
      }
    ],
    status: "DELIVERED",
    totalAmount: 21.97,
    deliveryAddress: "123 Main St, Anytown, USA",
    createdAt: "2023-06-15T14:30:00Z"
  },
  {
    id: 1002,
    userId: 1,
    restaurantId: 2,
    restaurantName: "Pizza Heaven",
    items: [
      {
        id: 201,
        name: "Margherita Pizza",
        price: 12.99,
        quantity: 1
      },
      {
        id: 203,
        name: "Garlic Bread",
        price: 4.99,
        quantity: 1
      }
    ],
    status: "DELIVERED",
    totalAmount: 17.98,
    deliveryAddress: "123 Main St, Anytown, USA",
    createdAt: "2023-06-10T18:45:00Z"
  },
  {
    id: 1003,
    userId: 1,
    restaurantId: 3,
    restaurantName: "Sushi Express",
    items: [
      {
        id: 301,
        name: "California Roll",
        price: 9.99,
        quantity: 2
      }
    ],
    status: "IN_TRANSIT",
    totalAmount: 19.98,
    deliveryAddress: "123 Main St, Anytown, USA",
    createdAt: "2023-06-20T12:15:00Z"
  }
];

// Mock payments
export const mockPayments = [
  {
    id: 2001,
    userId: 1,
    orderId: 1001,
    amount: 21.97,
    paymentMethod: "CREDIT_CARD",
    status: "COMPLETED",
    createdAt: "2023-06-15T14:32:00Z"
  },
  {
    id: 2002,
    userId: 1,
    orderId: 1002,
    amount: 17.98,
    paymentMethod: "PAYPAL",
    status: "COMPLETED",
    createdAt: "2023-06-10T18:47:00Z"
  },
  {
    id: 2003,
    userId: 1,
    orderId: 1003,
    amount: 19.98,
    paymentMethod: "CREDIT_CARD",
    status: "COMPLETED",
    createdAt: "2023-06-20T12:17:00Z"
  }
];

// Mock users
export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "CUSTOMER",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "RESTAURANT_OWNER",
    phone: "987-654-3210",
    address: "456 Oak St, Anytown, USA"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "DELIVERY_PERSON",
    phone: "555-123-4567",
    address: "789 Pine St, Anytown, USA"
  }
];

// Export all mock data
export default {
  restaurants: mockRestaurants,
  menuItems: mockMenuItems,
  orders: mockOrders,
  payments: mockPayments,
  users: mockUsers
};
