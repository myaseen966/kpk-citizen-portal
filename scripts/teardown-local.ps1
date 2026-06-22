# Removes everything deployed by deploy-local.ps1, but leaves minikube
# itself running (so you can redeploy quickly). Run `minikube delete`
# separately if you want to wipe the cluster entirely.
#
# Usage: .\scripts\teardown-local.ps1

$ErrorActionPreference = "Continue"

Write-Host "==> Removing monitoring stack..."
kubectl delete -f kubernetes/monitoring/ --ignore-not-found

Write-Host "==> Removing autoscaling resources..."
kubectl delete -f kubernetes/autoscaling/ --ignore-not-found

Write-Host "==> Removing application resources..."
kubectl delete -f kubernetes/service.yaml --ignore-not-found
kubectl delete -f kubernetes/deployment.yaml --ignore-not-found
kubectl delete -f kubernetes/postgres-service.yaml --ignore-not-found
kubectl delete -f kubernetes/postgres-deployment.yaml --ignore-not-found
kubectl delete -f kubernetes/postgres-pvc.yaml --ignore-not-found
kubectl delete -f kubernetes/configmap.yaml --ignore-not-found
kubectl delete -f kubernetes/secret.yaml --ignore-not-found
kubectl delete -f kubernetes/namespace.yaml --ignore-not-found

Write-Host ""
Write-Host "Torn down. minikube itself is still running." -ForegroundColor Green
Write-Host "Run 'minikube stop' to stop it, or 'minikube delete' to remove it entirely."
