import LoginRequest from './LoginRequest';
import SignupRequest from './SignupRequest';
import JwtResponse from './JwtResponse';
import UserDTO from './UserDTO';
import RestaurantDTO from './RestaurantDTO';
import MenuItemDTO from './MenuItemDTO';
import ReviewDTO from './ReviewDTO';
import OrderDTO from './OrderDTO';
import OrderItemDTO from './OrderItemDTO';
import PaymentDTO from './PaymentDTO';
import DeliveryDTO from './DeliveryDTO';

export {
  // Auth DTOs
  LoginRequest,
  SignupRequest,
  JwtResponse,

  // User DTOs
  UserDTO,

  // Restaurant DTOs
  RestaurantDTO,
  MenuItemDTO,
  ReviewDTO,

  // Order DTOs
  OrderDTO,
  OrderItemDTO,

  // Payment DTOs
  PaymentDTO,

  // Delivery DTOs
  DeliveryDTO
};

// You can add more models as they are created
export default {
  LoginRequest,
  SignupRequest,
  JwtResponse
};
