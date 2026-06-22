# Automates the full local minikube deployment of kpk-citizen-portal:
# starts minikube, builds the image inside minikube's Docker daemon,
# applies all Kubernetes manifests in the correct order, waits for
# everything to come up, then runs the Prisma migration.
#
# Usage (from the project root, in PowerShell):
#   .\scripts\deploy-local.ps1
#
# If script execution is blocked, run this once first (as Administrator):
#   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#
# Re-running this script is safe - `kubectl apply` is idempotent.

$ErrorActionPreference = "Stop"

function Test-CommandExists {
    param([string]$Command)
    return [bool](Get-Command $Command -ErrorAction SilentlyContinue)
}

Write-Host "==> Checking required tools..."
foreach ($cmd in @("minikube", "kubectl", "docker")) {
    if (-not (Test-CommandExists $cmd)) {
        Write-Error "ERROR: '$cmd' is not installed or not on PATH. See README.md Section 3 for install instructions."
        exit 1
    }
}

Write-Host "==> Starting minikube (if not already running)..."
$status = minikube status 2>&1
if ($LASTEXITCODE -ne 0) {
    minikube start --driver=docker
} else {
    Write-Host "    minikube is already running, skipping start."
}

Write-Host "==> Enabling metrics-server addon (needed for HPA)..."
minikube addons enable metrics-server

Write-Host "==> Building the Docker image inside minikube's Docker daemon..."
minikube docker-env | Invoke-Expression
docker build -t kpk-citizen-portal:latest .

Write-Host "==> Applying core Kubernetes manifests..."
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/postgres-pvc.yaml
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/postgres-service.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/autoscaling/

Write-Host "==> Waiting for Postgres to be ready..."
kubectl rollout status deployment/postgres -n kpk-citizen-portal --timeout=180s

Write-Host "==> Waiting for the app to be ready..."
kubectl rollout status deployment/kpk-citizen-portal -n kpk-citizen-portal --timeout=180s

Write-Host "==> Running Prisma migration..."
$appPod = kubectl get pods -n kpk-citizen-portal -l app=kpk-citizen-portal -o jsonpath='{.items[0].metadata.name}'
kubectl exec -n kpk-citizen-portal $appPod -- npx prisma migrate deploy

Write-Host "==> Applying monitoring stack (Prometheus + Grafana)..."
kubectl apply -f kubernetes/monitoring/
kubectl rollout status deployment/prometheus -n monitoring --timeout=180s
kubectl rollout status deployment/grafana -n monitoring --timeout=180s

Write-Host ""
Write-Host "Deployment complete." -ForegroundColor Green
Write-Host ""
Write-Host "Open the app:   minikube service kpk-citizen-portal-service -n kpk-citizen-portal"
Write-Host "Open Grafana:   minikube service grafana -n monitoring"
Write-Host "Grafana login:  admin / ChangeMe-Grafana-2026  (change this after first login)"
