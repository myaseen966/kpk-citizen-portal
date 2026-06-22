variable "do_token" {
  description = "DigitalOcean API token. Set via TF_VAR_do_token env var or a .auto.tfvars file (not committed) - never hardcode here."
  type        = string
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region slug."
  type        = string
  default     = "sgp1" # Singapore — closest commonly-available DO region to Pakistan. Change if you prefer another (e.g. "fra1", "nyc1").
}

variable "cluster_name" {
  description = "Name of the DOKS Kubernetes cluster."
  type        = string
  default     = "kpk-citizen-portal-cluster"
}

variable "kubernetes_version" {
  description = "DOKS Kubernetes version slug. Run `doctl kubernetes options versions` to list current values."
  type        = string
  default     = "1.31.1-do.5"
}

variable "node_size" {
  description = "Droplet size slug for worker nodes."
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "min_nodes" {
  description = "Minimum worker node count (cluster autoscaler floor)."
  type        = number
  default     = 2
}

variable "max_nodes" {
  description = "Maximum worker node count (cluster autoscaler ceiling)."
  type        = number
  default     = 4
}

variable "db_name" {
  description = "Name of the managed PostgreSQL database/cluster."
  type        = string
  default     = "citizen-portal-db"
}

variable "db_size" {
  description = "Managed database droplet size slug."
  type        = string
  default     = "db-s-1vcpu-1gb"
}

variable "db_engine_version" {
  description = "PostgreSQL major version for the managed database."
  type        = string
  default     = "16"
}

variable "jwt_secret" {
  description = "Value for the application's JWT_SECRET env var. Set via TF_VAR_jwt_secret or a .auto.tfvars file (not committed) - do not hardcode a real secret here."
  type        = string
  sensitive   = true
  default     = "pakistan-citizen-portal-super-secret-key-2026" # CHANGE for any real deployment.
}

variable "nextauth_url" {
  description = "Value for the application's NEXTAUTH_URL env var (the public URL the app will be served at)."
  type        = string
  default     = "http://localhost:3000" # Update once you have a real domain/ingress.
}
