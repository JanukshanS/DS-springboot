#!/bin/bash

# Exit on error
set -e

# Default values
DOMAIN=""
IP=""
DB_ENV_FILE="../kubernetes/database-env.env"

# Email configuration
EMAIL_USERNAME=""
EMAIL_PASSWORD=""

# Redis configuration
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --domain)
      DOMAIN="$2"
      shift
      shift
      ;;
    --ip)
      IP="$2"
      shift
      shift
      ;;
    --db-env-file)
      DB_ENV_FILE="$2"
      shift
      shift
      ;;
    --email-username)
      EMAIL_USERNAME="$2"
      shift
      shift
      ;;
    --email-password)
      EMAIL_PASSWORD="$2"
      shift
      shift
      ;;
    --redis-host)
      REDIS_HOST="$2"
      shift
      shift
      ;;
    --redis-port)
      REDIS_PORT="$2"
      shift
      shift
      ;;
    --redis-password)
      REDIS_PASSWORD="$2"
      shift
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
  echo "Error: Domain is required."
  exit 1
fi

# Check if IP is provided
if [ -z "$IP" ]; then
  echo "Error: IP is required."
  exit 1
fi

# Check if database environment file exists
if [ ! -f "$DB_ENV_FILE" ]; then
  echo "Error: Database environment file not found at $DB_ENV_FILE"
  exit 1
fi

echo "Deploying Food Delivery Application to Kubernetes..."
echo "Domain: $DOMAIN"
echo "Server IP: $IP"
echo "Using database configuration from: $DB_ENV_FILE"

# Update ingress configuration with the provided domain
echo "Updating ingress configuration..."
sed -i "s/yourdomain.com/$DOMAIN/g" ../kubernetes/ingress.yaml
sed -i "s/api.yourdomain.com/api.$DOMAIN/g" ../kubernetes/ingress.yaml

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."

# Create namespace
kubectl apply -f ../kubernetes/namespace.yaml

# Create ConfigMap and Secrets from the database environment file
echo "Creating database ConfigMap and Secrets..."

# Create ConfigMap from non-sensitive values in the environment file
grep -v "_PASSWORD=\|SECRET_KEY=" "$DB_ENV_FILE" | kubectl create configmap database-config --namespace=food-delivery --from-env-file=/dev/stdin

# Create Secrets from sensitive values in the environment file
grep "_PASSWORD=\|SECRET_KEY=" "$DB_ENV_FILE" | kubectl create secret generic database-secrets --namespace=food-delivery --from-env-file=/dev/stdin

# Add email credentials if provided
if [ ! -z "$EMAIL_USERNAME" ] && [ ! -z "$EMAIL_PASSWORD" ]; then
  kubectl patch secret database-secrets --namespace=food-delivery --type=merge --patch="{\"data\":{\"EMAIL_USERNAME\": \"$(echo -n $EMAIL_USERNAME | base64)\", \"EMAIL_PASSWORD\": \"$(echo -n $EMAIL_PASSWORD | base64)\"}}"
  echo "Added email credentials to secrets"
fi

# Add Redis configuration
kubectl patch configmap database-config --namespace=food-delivery --type=merge --patch="{\"data\":{\"REDIS_HOST\": \"$REDIS_HOST\", \"REDIS_PORT\": \"$REDIS_PORT\"}}"
if [ ! -z "$REDIS_PASSWORD" ]; then
  kubectl patch secret database-secrets --namespace=food-delivery --type=merge --patch="{\"data\":{\"REDIS_PASSWORD\": \"$(echo -n $REDIS_PASSWORD | base64)\"}}"
fi

# Apply backend services
kubectl apply -f ../kubernetes/gateway-service.yaml
kubectl apply -f ../kubernetes/user-service.yaml
kubectl apply -f ../kubernetes/restaurant-service.yaml
kubectl apply -f ../kubernetes/order-service.yaml
kubectl apply -f ../kubernetes/payment-service.yaml
kubectl apply -f ../kubernetes/delivery-service.yaml
kubectl apply -f ../kubernetes/notification-service.yaml

# Apply frontend
kubectl apply -f ../kubernetes/frontend.yaml

# Apply resource quota
kubectl apply -f ../kubernetes/resource-quota.yaml

# Apply ingress
kubectl apply -f ../kubernetes/ingress.yaml

echo "Kubernetes deployment completed successfully."
echo ""
echo "Next steps:"
echo "1. Configure your domain DNS settings to point to your server IP: $IP"
echo "   Add the following DNS records:"
echo "   - A record: $DOMAIN -> $IP"
echo "   - A record: api.$DOMAIN -> $IP"
echo ""
echo "2. Wait for DNS propagation (this can take up to 24-48 hours)"
echo ""
echo "3. Access your application at: https://$DOMAIN"
echo "   API Gateway will be available at: https://api.$DOMAIN"
