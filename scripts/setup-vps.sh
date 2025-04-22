#!/bin/bash

# Exit on error
set -e

# Default values
DOMAIN="uber.icy-r.dev"
IP="157.245.60.149"

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
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
  echo "Error: Domain is required. Usage: ./setup-vps.sh --domain yourdomain.com --ip your.server.ip"
  exit 1
fi

# Check if IP is provided
if [ -z "$IP" ]; then
  echo "Error: IP is required. Usage: ./setup-vps.sh --domain yourdomain.com --ip your.server.ip"
  exit 1
fi

echo "Setting up VPS for Food Delivery Application..."
echo "Domain: $DOMAIN"
echo "Server IP: $IP"

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Install kubectl
echo "Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Install Minikube (for single-node Kubernetes)
echo "Installing Minikube..."
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

# Start Minikube with resource limits appropriate for 8GB RAM VPS
echo "Starting Minikube..."
minikube start --driver=docker --memory=6g --cpus=4 --force

# Install NGINX Ingress Controller
echo "Installing NGINX Ingress Controller..."
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

# Copy database configuration files
echo "Setting up database configuration..."
cp ../kubernetes/database-env.env ./database-env.env
cp ../kubernetes/database-configmap.yaml ./database-configmap.yaml
cp ../kubernetes/database-secrets.yaml ./database-secrets.yaml

# Deploy the application
echo "Deploying the application..."
./deploy-k8s.sh --domain $DOMAIN --ip $IP --db-env-file ./database-env.env

echo "VPS setup completed successfully."
echo ""
echo "Next steps:"
echo "1. Configure your domain DNS settings to point to your server IP: $IP"
echo "   Add the following DNS records:"
echo "   - A record: $DOMAIN -> $IP"
echo "   - A record: api.$DOMAIN -> $IP"
echo ""
echo "2. Run the deployment script to deploy your application:"
echo "   ./deploy-k8s.sh --domain $DOMAIN --ip $IP"
echo ""
echo "3. Wait for DNS propagation (this can take up to 24-48 hours)"
echo ""
echo "4. Access your application at: https://$DOMAIN"
echo "   API Gateway will be available at: https://api.$DOMAIN"
