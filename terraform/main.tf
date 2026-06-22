# ---------------------------------------------------------------------
# Kubernetes cluster (DigitalOcean Kubernetes Service - DOKS)
# Maps to: Amazon EKS / Google GKE / Azure AKS on other clouds.
# ---------------------------------------------------------------------
resource "digitalocean_kubernetes_cluster" "this" {
  name    = var.cluster_name
  region  = var.region
  version = var.kubernetes_version

  node_pool {
    name       = "${var.cluster_name}-pool"
    size       = var.node_size
    auto_scale = true
    min_nodes  = var.min_nodes
    max_nodes  = var.max_nodes
    tags       = ["kpk-citizen-portal"]
  }

  maintenance_policy {
    start_time = "04:00" # local cluster maintenance window, low-traffic hours
    day        = "sunday"
  }
}

# ---------------------------------------------------------------------
# Managed PostgreSQL database
# Maps to: Amazon RDS / Google Cloud SQL / Azure Database for PostgreSQL
# on other clouds.
#
# This REPLACES the in-cluster postgres-deployment.yaml /
# postgres-service.yaml / postgres-pvc.yaml for production use — a
# managed database handles backups, failover, and patching for you. The
# in-cluster Postgres manifests are still provided for local/demo
# clusters (minikube, kind) where provisioning a managed database isn't
# practical or necessary.
# ---------------------------------------------------------------------
resource "digitalocean_database_cluster" "postgres" {
  name       = var.db_name
  engine     = "pg"
  version    = var.db_engine_version
  size       = var.db_size
  region     = var.region
  node_count = 1
  tags       = ["kpk-citizen-portal"]
}

resource "digitalocean_database_db" "citizen_portal" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "citizen_portal"
}

resource "digitalocean_database_firewall" "postgres_fw" {
  cluster_id = digitalocean_database_cluster.postgres.id

  rule {
    type  = "k8s"
    value = digitalocean_kubernetes_cluster.this.id
  }
}

# ---------------------------------------------------------------------
# Kubernetes namespace + Secret, created via Terraform so the
# DATABASE_URL can be wired automatically from the managed database's
# real connection details, instead of hand-editing kubernetes/secret.yaml.
#
# NOTE: variable names inside the Secret are kept IDENTICAL to the
# application's .env file: DATABASE_URL, JWT_SECRET, NEXTAUTH_URL.
# ---------------------------------------------------------------------
resource "kubernetes_namespace" "app" {
  metadata {
    name = "kpk-citizen-portal"
  }
  depends_on = [digitalocean_kubernetes_cluster.this]
}

resource "kubernetes_secret" "app" {
  metadata {
    name      = "kpk-citizen-portal-secret"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    DATABASE_URL = "postgresql://${digitalocean_database_cluster.postgres.user}:${digitalocean_database_cluster.postgres.password}@${digitalocean_database_cluster.postgres.private_host}:${digitalocean_database_cluster.postgres.port}/${digitalocean_database_db.citizen_portal.name}?sslmode=require&connection_limit=5&pool_timeout=30"
    JWT_SECRET   = var.jwt_secret
    NEXTAUTH_URL = var.nextauth_url
  }

  type = "Opaque"
}
