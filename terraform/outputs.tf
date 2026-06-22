output "cluster_id" {
  description = "ID of the created DOKS cluster."
  value       = digitalocean_kubernetes_cluster.this.id
}

output "cluster_endpoint" {
  description = "Kubernetes API endpoint for the cluster."
  value       = digitalocean_kubernetes_cluster.this.endpoint
}

output "kubeconfig_command" {
  description = "Run this after apply to fetch kubeconfig credentials via doctl."
  value       = "doctl kubernetes cluster kubeconfig save ${digitalocean_kubernetes_cluster.this.name}"
}

output "database_host" {
  description = "Private hostname of the managed PostgreSQL cluster (reachable from within the DOKS cluster only)."
  value       = digitalocean_database_cluster.postgres.private_host
}

output "database_connection_string" {
  description = "Full DATABASE_URL value (matches what's written into the Kubernetes Secret)."
  value       = "postgresql://${digitalocean_database_cluster.postgres.user}:${digitalocean_database_cluster.postgres.password}@${digitalocean_database_cluster.postgres.private_host}:${digitalocean_database_cluster.postgres.port}/${digitalocean_database_db.citizen_portal.name}?sslmode=require&connection_limit=5&pool_timeout=30"
  sensitive   = true
}
