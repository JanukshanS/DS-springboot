#!/bin/bash

# This script is designed to deploy the Food Delivery application on a VPS
# when running as root, bypassing the usual Minikube restrictions

set -e

# Default values
DOMAIN="uber.icy-r.dev"
IP="157.245.60.149"
DB_ENV_FILE="../kubernetes/database-env.env"

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
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
  echo "Error: Domain is required."
  echo "Usage: ./deploy-as-root.sh --domain yourdomain.com --ip your.server.ip [--db-env-file path/to/env/file]"
  exit 1
fi

# Check if IP is provided
if [ -z "$IP" ]; then
  echo "Error: IP is required."
  echo "Usage: ./deploy-as-root.sh --domain yourdomain.com --ip your.server.ip [--db-env-file path/to/env/file]"
  exit 1
fi

# Check if database environment file exists
if [ ! -f "$DB_ENV_FILE" ]; then
  echo "Error: Database environment file not found at $DB_ENV_FILE"
  exit 1
fi

echo "Deploying Food Delivery Application on VPS as root..."
echo "Domain: $DOMAIN"
echo "Server IP: $IP"
echo "Using database configuration from: $DB_ENV_FILE"

# Start Minikube with force flag to allow running as root
echo "Starting Minikube..."
minikube start --driver=docker --memory=6g --cpus=4 --force

# Enable ingress addon
echo "Enabling NGINX Ingress Controller..."
minikube addons enable ingress

# Install cert-manager for SSL certificates
echo "Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml

# Wait for cert-manager to be ready
echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s

# Create LetsEncrypt ClusterIssuer
echo "Creating LetsEncrypt ClusterIssuer..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@$DOMAIN
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Create namespace
echo "Creating namespace..."
kubectl apply -f ../kubernetes/namespace.yaml

# Create or update ConfigMap and Secrets from the database environment file
echo "Creating or updating database ConfigMap and Secrets..."

# Check if ConfigMap exists
if kubectl get configmap database-config -n food-delivery &>/dev/null; then
  echo "ConfigMap already exists, updating..."
  # Delete existing ConfigMap
  kubectl delete configmap database-config -n food-delivery
fi

# Create ConfigMap from non-sensitive values in the environment file
grep -v "_PASSWORD=\|SECRET_KEY=" "$DB_ENV_FILE" | kubectl create configmap database-config --namespace=food-delivery --from-env-file=/dev/stdin

# Check if Secret exists
if kubectl get secret database-secrets -n food-delivery &>/dev/null; then
  echo "Secret already exists, updating..."
  # Delete existing Secret
  kubectl delete secret database-secrets -n food-delivery
fi

# Create Secrets from sensitive values in the environment file
grep "_PASSWORD=\|SECRET_KEY=" "$DB_ENV_FILE" | kubectl create secret generic database-secrets --namespace=food-delivery --from-env-file=/dev/stdin

# Update ingress configuration with the provided domain
echo "Updating ingress configuration..."
sed -i "s/host: .*/host: $DOMAIN/g" ../kubernetes/ingress.yaml
sed -i "s/- host: .*/- host: $DOMAIN/g" ../kubernetes/ingress.yaml

# Apply backend services
echo "Deploying backend services..."
kubectl apply -f ../kubernetes/gateway-service.yaml
kubectl apply -f ../kubernetes/user-service.yaml
kubectl apply -f ../kubernetes/restaurant-service.yaml
kubectl apply -f ../kubernetes/order-service.yaml
kubectl apply -f ../kubernetes/payment-service.yaml
kubectl apply -f ../kubernetes/delivery-service.yaml
kubectl apply -f ../kubernetes/notification-service.yaml

# Apply frontend service
echo "Deploying frontend service..."
kubectl apply -f ../kubernetes/frontend.yaml

# Apply ingress configuration
echo "Deploying ingress configuration..."
kubectl apply -f ../kubernetes/ingress.yaml

# Apply resource quotas
echo "Applying resource quotas..."
kubectl apply -f ../kubernetes/resource-quota.yaml

# Wait for all pods to be ready
echo "Waiting for all pods to be ready..."
kubectl wait --namespace=food-delivery --for=condition=ready pod --all --timeout=300s

echo "Deployment completed successfully!"
echo ""
echo "Your application should be accessible at: https://$DOMAIN"
echo "It may take a few minutes for DNS to propagate and SSL certificates to be issued."
echo ""
echo "To check the status of your pods, run:"
echo "kubectl get pods -n food-delivery"
echo ""
echo "To check the status of your services, run:"
echo "kubectl get services -n food-delivery"
echo ""
echo "To check the status of your ingress, run:"
echo "kubectl get ingress -n food-delivery"
echo ""
echo "To view the logs of a specific pod, run:"
echo "kubectl logs -n food-delivery <pod-name>"
