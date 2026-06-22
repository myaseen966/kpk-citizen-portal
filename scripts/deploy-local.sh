#!/usr/bin/env bash
# Automates the full local minikube deployment of kpk-citizen-portal:
# starts minikube, builds the image inside minikube's Docker daemon,
# applies all Kubernetes manifests in the correct order, waits for
# everything to come up, then runs the Prisma migration.
#
# Usage (from the project root, macOS/Linux/WSL/Git Bash):
#   chmod +x scripts/deploy-local.sh
#   ./scripts/deploy-local.sh
#
# Re-running this script is safe — `kubectl apply` is idempotent.

set -euo pipefail

echo "==> Checking required tools..."
for cmd in minikube kubectl docker; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "ERROR: '$cmd' is not installed or not on PATH. See README.md Section 3 for install instructions." >&2
    exit 1
  fi
done

echo "==> Starting minikube (if not already running)..."
if ! minikube status >/dev/null 2>&1; then
  minikube start --driver=docker
else
  echo "    minikube is already running, skipping start."
fi

echo "==> Enabling metrics-server addon (needed for HPA)..."
minikube addons enable metrics-server

echo "==> Building the Docker image inside minikube's Docker daemon..."
eval "$(minikube docker-env)"
docker build -t kpk-citizen-portal:latest .

echo "==> Applying core Kubernetes manifests..."
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/postgres-pvc.yaml
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/postgres-service.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/autoscaling/

echo "==> Waiting for Postgres to be ready..."
kubectl rollout status deployment/postgres -n kpk-citizen-portal --timeout=180s

echo "==> Waiting for the app to be ready..."
kubectl rollout status deployment/kpk-citizen-portal -n kpk-citizen-portal --timeout=180s

echo "==> Running Prisma migration..."
APP_POD=$(kubectl get pods -n kpk-citizen-portal -l app=kpk-citizen-portal -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n kpk-citizen-portal "$APP_POD" -- npx prisma migrate deploy

echo "==> Applying monitoring stack (Prometheus + Grafana)..."
kubectl apply -f kubernetes/monitoring/
kubectl rollout status deployment/prometheus -n monitoring --timeout=180s
kubectl rollout status deployment/grafana -n monitoring --timeout=180s

echo ""
echo "✅ Deployment complete."
echo ""
echo "Open the app:       minikube service kpk-citizen-portal-service -n kpk-citizen-portal"
echo "Open Grafana:        minikube service grafana -n monitoring"
echo "Grafana login:       admin / ChangeMe-Grafana-2026  (change this after first login)"
