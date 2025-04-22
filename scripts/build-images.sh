#!/bin/bash

# Exit on error
set -e

echo "Building Docker images for Food Delivery Application..."

# Build frontend
echo "Building frontend..."
cd ../frontend-v1
docker build -t food-delivery/frontend:latest .
echo "Frontend built successfully."

# Build backend services
cd ../services

# Gateway Service
echo "Building Gateway Service..."
cd gateway
docker build -t food-delivery/gateway-service:latest .
cd ..

# User Service
echo "Building User Service..."
cd user_service
docker build -t food-delivery/user-service:latest .
cd ..

# Restaurant Service
echo "Building Restaurant Service..."
cd restaurant_service
docker build -t food-delivery/restaurant-service:latest .
cd ..

# Order Service
echo "Building Order Service..."
cd order_service
docker build -t food-delivery/order-service:latest .
cd ..

# Payment Service
echo "Building Payment Service..."
cd payment_service
docker build -t food-delivery/payment-service:latest .
cd ..

# Delivery Service
echo "Building Delivery Service..."
cd delivery_service
docker build -t food-delivery/delivery-service:latest .
cd ..

# Notification Service
echo "Building Notification Service..."
cd notification_service
docker build -t food-delivery/notification-service:latest .
cd ..

echo "All Docker images built successfully."

# If a registry is provided, push images to it
if [ ! -z "$1" ]; then
  REGISTRY=$1
  
  echo "Tagging and pushing images to registry: $REGISTRY"
  
  # Tag and push images
  docker tag food-delivery/frontend:latest $REGISTRY/food-delivery/frontend:latest
  docker tag food-delivery/gateway-service:latest $REGISTRY/food-delivery/gateway-service:latest
  docker tag food-delivery/user-service:latest $REGISTRY/food-delivery/user-service:latest
  docker tag food-delivery/restaurant-service:latest $REGISTRY/food-delivery/restaurant-service:latest
  docker tag food-delivery/order-service:latest $REGISTRY/food-delivery/order-service:latest
  docker tag food-delivery/payment-service:latest $REGISTRY/food-delivery/payment-service:latest
  docker tag food-delivery/delivery-service:latest $REGISTRY/food-delivery/delivery-service:latest
  docker tag food-delivery/notification-service:latest $REGISTRY/food-delivery/notification-service:latest
  
  docker push $REGISTRY/food-delivery/frontend:latest
  docker push $REGISTRY/food-delivery/gateway-service:latest
  docker push $REGISTRY/food-delivery/user-service:latest
  docker push $REGISTRY/food-delivery/restaurant-service:latest
  docker push $REGISTRY/food-delivery/order-service:latest
  docker push $REGISTRY/food-delivery/payment-service:latest
  docker push $REGISTRY/food-delivery/delivery-service:latest
  docker push $REGISTRY/food-delivery/notification-service:latest
  
  echo "All images pushed to registry successfully."
fi
