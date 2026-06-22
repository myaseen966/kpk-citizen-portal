#!/usr/bin/env bash
# Removes everything deployed by deploy-local.sh, but leaves minikube
# itself running (so you can redeploy quickly). Run `minikube delete`
# separately if you want to wipe the cluster entirely.
#
# Usage: ./scripts/teardown-local.sh

set -euo pipefail

echo "==> Removing monitoring stack..."
kubectl delete -f kubernetes/monitoring/ --ignore-not-found

echo "==> Removing autoscaling resources..."
kubectl delete -f kubernetes/autoscaling/ --ignore-not-found

echo "==> Removing application resources..."
kubectl delete -f kubernetes/service.yaml --ignore-not-found
kubectl delete -f kubernetes/deployment.yaml --ignore-not-found
kubectl delete -f kubernetes/postgres-service.yaml --ignore-not-found
kubectl delete -f kubernetes/postgres-deployment.yaml --ignore-not-found
kubectl delete -f kubernetes/postgres-pvc.yaml --ignore-not-found
kubectl delete -f kubernetes/configmap.yaml --ignore-not-found
kubectl delete -f kubernetes/secret.yaml --ignore-not-found
kubectl delete -f kubernetes/namespace.yaml --ignore-not-found

echo ""
echo "✅ Torn down. minikube itself is still running."
echo "Run 'minikube stop' to stop it, or 'minikube delete' to remove it entirely."
