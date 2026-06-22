# Terraform IaC for provisioning a managed Kubernetes cluster and a
# managed PostgreSQL database on DigitalOcean (DOKS + Managed Databases).
#
# WHY DIGITALOCEAN: chosen as a concrete, working reference implementation
# that needs minimal account setup (a single API token) compared to AWS/
# GCP/Azure, which need IAM roles, VPC design, etc. before any Kubernetes
# resource can be created. The structure below (cluster + node pool +
# managed Postgres + firewall) maps directly onto equivalent resources in
# other providers (EKS+RDS, GKE+Cloud SQL, AKS+Azure Database for
# PostgreSQL) if you need to target a different cloud — see README.md
# "Adapting Terraform to another cloud provider".
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.41"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.31"
    }
  }

  # Remote state is strongly recommended for any real/shared use so that
  # state isn't only on one machine. Uncomment and configure one of these
  # after creating the backend resource (S3 bucket, DO Space, Terraform
  # Cloud workspace, etc.):
  #
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "kpk-citizen-portal/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "digitalocean" {
  token = var.do_token
}

provider "kubernetes" {
  host                   = digitalocean_kubernetes_cluster.this.endpoint
  token                  = digitalocean_kubernetes_cluster.this.kube_config[0].token
  cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.this.kube_config[0].cluster_ca_certificate)
}
