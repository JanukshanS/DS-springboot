#!/bin/bash

# This script cleans up the individual database secret files
# since we're now using a centralized database ConfigMap and Secret approach

echo "Cleaning up individual database secret files..."

# Remove individual database secret files
rm -f ../kubernetes/gateway-db-secrets.yaml
rm -f ../kubernetes/user-db-secrets.yaml
rm -f ../kubernetes/restaurant-db-secrets.yaml
rm -f ../kubernetes/order-db-secrets.yaml
rm -f ../kubernetes/payment-db-secrets.yaml
rm -f ../kubernetes/delivery-db-secrets.yaml
rm -f ../kubernetes/notification-db-secrets.yaml

echo "Cleanup complete!"
