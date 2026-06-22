# 🏛️ KPK Citizen Portal

> Official Citizen Portal for the Government of Khyber Pakhtunkhwa
> Built by CoreCloud Pvt. Ltd.

![KPK Citizen Portal](public/logo.png)

## 📋 Overview

The KPK Citizen Portal is a full-stack web application that connects citizens
of Khyber Pakhtunkhwa directly with government authorities for:

- 📢 **Grievance Redressal** — Lodge complaints against government departments
- ⚙️ **E-Services** — Apply for certificates and licenses online
- 💡 **Suggestions** — Submit ideas for policy and governance reforms
- 📊 **Application Tracking** — Monitor status of all submitted applications

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Full-stack React framework |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Styling |
| Prisma ORM | Database management |
| PostgreSQL | Database |
| bcryptjs | Password encryption |
| JSON Web Tokens | Authentication |

---

## ✨ Features

### Citizen Features
- ✅ CNIC-based registration and login
- ✅ Personal dashboard with real-time stats
- ✅ Lodge complaints with 35+ categories
- ✅ Submit suggestions with 40+ categories and sub-departments
- ✅ Apply for 10 government e-services
- ✅ File upload support (JPG, PNG, PDF, Word)
- ✅ Province → District → Tehsil location selection (KPK)
- ✅ Hide identity option for sensitive complaints
- ✅ Real-time notifications on application status changes
- ✅ Profile management with profile picture upload
- ✅ Forgot password with CNIC + email verification

### Admin Features
- ✅ Separate admin login panel
- ✅ Dashboard with all statistics
- ✅ Manage all complaints, suggestions, e-services
- ✅ Update application status (Pending → In Progress → Approved/Rejected)
- ✅ Add admin notes visible to citizens
- ✅ Automatic citizen notification on status change
- ✅ View all registered citizens

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/kpk-citizen-portal.git
cd kpk-citizen-portal
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and fill in your values:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/citizen_portal"
JWT_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**4. Set up the database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**5. Create first admin account**
```bash
npx tsx prisma/seed.ts
```

**6. Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure
kpk-citizen-portal/

├── app/

│   ├── (auth)/

│   │   ├── login/

│   │   ├── register/

│   │   └── forgot-password/

│   ├── admin/

│   │   └── dashboard/

│   ├── dashboard/

│   │   ├── applications/

│   │   ├── complaints/

│   │   ├── contact/

│   │   ├── eservices/

│   │   ├── manual/

│   │   ├── profile/

│   │   └── suggestions/

│   ├── api/

│   │   ├── admin/

│   │   ├── auth/

│   │   ├── dashboard/

│   │   └── upload/

│   └── terms/

├── lib/

│   ├── auth.ts

│   └── prisma.ts

├── prisma/

│   ├── schema.prisma

│   └── seed.ts

├── public/

│   └── logo.png

├── middleware.ts

└── .env.example

---

## 🔐 Default Admin Credentials
Email:    admin@kpkcitizens.gov.pk
Password: Admin@123

> ⚠️ Change these credentials immediately in production!

---

## 📄 License

This project is proprietary software developed by **CoreCloud Pvt. Ltd.**
for the Government of Khyber Pakhtunkhwa.

---

## 👨‍💻 Developed By

**CoreCloud Pvt. Ltd.**
KPK-based Technology Firm

---

# 🐳 Deployment Guide — Docker, Kubernetes, CI/CD, IaC & Observability

This section covers running the application as a container, locally with
Docker Compose, on Kubernetes, with automated CI/CD, cloud infrastructure
provisioned via Terraform, and monitored with Prometheus/Grafana.

**Contents:**
1. [Run locally with Docker Compose](#1-run-locally-with-docker-compose)
2. [Build and push to Docker Hub](#2-build-and-push-to-docker-hub)
3. [Deploy to Kubernetes (local cluster with minikube)](#3-deploy-to-kubernetes-local-cluster-with-minikube)
3B. [Deploying to Docker Hub + a real cloud cluster (later)](#3b-deploying-to-docker-hub--a-real-cloud-cluster-later)
4. [Notes & production considerations](#4-notes--production-considerations)
5. [Autoscaling & self-healing](#5-autoscaling--self-healing)
6. [Observability — Prometheus & Grafana](#6-observability--prometheus--grafana)
7. [CI/CD — GitHub Actions](#7-cicd--github-actions)
8. [Infrastructure as Code — Terraform](#8-infrastructure-as-code--terraform)
9. [Commands that work the same on Windows, macOS, and Linux](#9-commands-that-work-the-same-on-windows-macos-and-linux)

> **New here? Start with Section 3** — it runs the entire stack locally
> on minikube with no cloud account and no cost. Sections 2, 3B, and 8
> (Docker Hub / cloud / Terraform) are for later, once you're ready to
> deploy somewhere real.

### What was changed in the application source, and why

Per your instruction not to change application logic, **exactly one line**
was touched outside the new deployment files: `next.config.ts` now sets
`output: "standalone"`. This is a Next.js *build output* setting, not
application behavior — it tells `next build` to produce a minimal
self-contained server bundle, which is what makes the Docker image small
and reliable. No routes, components, database queries, or auth logic were
modified.

## Project structure (deployment-relevant files)

```
kpk-citizen-portal/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── prisma/
├── app/
├── package.json
├── scripts/
│   ├── deploy-local.sh         # One-command minikube setup (Section 3.1)
│   ├── deploy-local.ps1        # Same, for Windows PowerShell
│   ├── teardown-local.sh
│   └── teardown-local.ps1
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Build → push to Docker Hub → deploy (Section 7)
├── terraform/                 # IaC: provisions managed K8s cluster + database (Section 8)
│   ├── providers.tf
│   ├── variables.tf
│   ├── main.tf
│   ├── outputs.tf
│   ├── terraform.tfvars.example
│   └── .gitignore
├── kubernetes/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── postgres-pvc.yaml
│   ├── secret.yaml
│   ├── configmap.yaml
│   ├── autoscaling/
│   │   ├── hpa.yaml            # Section 5
│   │   └── pdb.yaml
│   └── monitoring/
│       ├── 00-namespace.yaml   # Section 6
│       ├── 10-prometheus.yaml
│       └── 20-grafana.yaml
└── README.md
```

## Environment variables

The application reads three environment variables, with **identical names**
to the original `.env` file:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (used by Prisma) |
| `JWT_SECRET` | Secret used to sign/verify JWTs for citizen & admin auth |
| `NEXTAUTH_URL` | Base URL of the deployed app |

`.env` is **never** copied into the Docker image — it's excluded via
`.dockerignore`. Locally, Docker Compose injects these as plain environment
variables; on Kubernetes, they are injected from a `Secret`
(`kubernetes/secret.yaml`) using `valueFrom.secretKeyRef`.

---

## 1. Run locally with Docker Compose

This builds the app image from the `Dockerfile` and starts it alongside a
PostgreSQL container, fully isolated from your host machine's `.env`.

```bash
docker compose up --build
```

This will:
- Build the `app` image from the `Dockerfile`
- Start a `postgres:16-alpine` container with database `citizen_portal`
- Start the app on **http://localhost:3000**, connected to Postgres at
  `postgres:5432` (the Docker Compose service name resolves inside the
  network — note this differs from `localhost` used in local, non-Docker
  development)

Run migrations once the database is up (first run, or after any schema change):

```bash
docker compose exec app npx prisma migrate deploy
```

Stop everything:

```bash
docker compose down
```

Stop and also remove the Postgres data volume (full reset):

```bash
docker compose down -v
```

---

## 2. Build and push to Docker Hub

Replace `DOCKERHUB_USERNAME` with your actual Docker Hub username in every
command below, and in `kubernetes/deployment.yaml`.

```bash
# 1. Log in to Docker Hub
docker login

# 2. Build the production image
docker build -t kpk-citizen-portal:latest .

# 3. Tag it for Docker Hub
docker tag kpk-citizen-portal:latest DOCKERHUB_USERNAME/kpk-citizen-portal:latest

# 4. Push it
docker push DOCKERHUB_USERNAME/kpk-citizen-portal:latest
```

> The Dockerfile does **not** run Prisma migrations during build — only
> `npx prisma generate` (which generates client code from the schema and
> needs no database connection). Migrations are run separately, after
> deployment, against the real target database — see step 4 below.

---

## 3. Deploy to Kubernetes (local cluster with minikube)

This is the **default, ready-to-use path** — no cloud account, no Docker
Hub push required. `kubernetes/deployment.yaml` is already configured to
use a locally-built image (`image: kpk-citizen-portal:latest` with
`imagePullPolicy: Never`).

### 3.1 One-command setup (recommended)

A helper script automates everything in this section — install
minikube/kubectl first (3.2 below), then run:

```bash
# macOS / Linux / WSL / Git Bash
chmod +x scripts/deploy-local.sh
./scripts/deploy-local.sh
```

```powershell
# Windows PowerShell
.\scripts\deploy-local.ps1
```

It starts minikube, builds the image inside minikube's Docker daemon,
applies every manifest in order, waits for rollouts, and runs the Prisma
migration automatically. Skip to **3.7** once it finishes. The manual
steps below are what the script does, broken out individually — useful
if something fails partway and you want to debug a single step.

### 3.2 Install minikube and kubectl

**Windows (PowerShell, as Administrator):**
```powershell
winget install Kubernetes.minikube
winget install Kubernetes.kubectl
```

**macOS:**
```bash
brew install minikube kubectl
```

**Linux:**
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl
```

Docker must already be installed and running (the same Docker used in
Section 1).

### 3.3 Start the cluster and enable autoscaling support

```bash
minikube start --driver=docker
minikube addons enable metrics-server
```

### 3.4 Build the image inside minikube's Docker daemon

This makes the image available to the cluster without pushing to Docker
Hub.

```bash
# macOS / Linux
eval $(minikube docker-env)
docker build -t kpk-citizen-portal:latest .
```

```powershell
# Windows PowerShell
minikube docker-env | Invoke-Expression
docker build -t kpk-citizen-portal:latest .
```

> **Important:** `minikube docker-env` only applies to the current
> terminal session. If you open a new terminal, re-run that command
> before building again — otherwise `docker build` will build into your
> regular Docker, not minikube's, and the cluster won't find the image.

### 3.5 Apply all manifests

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/postgres-pvc.yaml
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/postgres-service.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/autoscaling/
```

### 3.6 Check status and run the migration

```bash
kubectl get pods -n kpk-citizen-portal -w
```

`Ctrl+C` once both `postgres-...` and the two `kpk-citizen-portal-...`
pods show `STATUS: Running` and `READY: 1/1`. Then:

```bash
kubectl get pods -n kpk-citizen-portal -l app=kpk-citizen-portal
kubectl exec -it <app-pod-name> -n kpk-citizen-portal -- npx prisma migrate deploy
```

(Run the migration again any time you rebuild the image with schema
changes.)

### 3.7 Open the app

```bash
minikube service kpk-citizen-portal-service -n kpk-citizen-portal
```

This opens it directly in your browser — no manual IP/port lookup
needed.

### 3.8 Tear down

```bash
# macOS / Linux / WSL / Git Bash
./scripts/teardown-local.sh
```
```powershell
# Windows PowerShell
.\scripts\teardown-local.ps1
```

This removes everything from the cluster but leaves minikube itself
running, so you can redeploy quickly. To stop or fully remove minikube:

```bash
minikube stop      # pause it, keep state
minikube delete     # wipe it completely
```

---

## 3B. Deploying to Docker Hub + a real cloud cluster (later)

Once you've tested locally and are ready to move to a real cloud cluster
(EKS/GKE/AKS/DOKS/etc.), two things change from the local setup above:

### 3B.1 Push the image to Docker Hub instead of building locally

Follow **Section 2** above (`docker login` / `docker tag` / `docker
push`) to publish your image.

### 3B.2 Point the Deployment at the Docker Hub image

Edit `kubernetes/deployment.yaml` and change:

```yaml
image: kpk-citizen-portal:latest
imagePullPolicy: Never
```

to:

```yaml
image: DOCKERHUB_USERNAME/kpk-citizen-portal:latest
imagePullPolicy: Always
```

Everything else (Section 3.5 onward) is identical — `kubectl apply -f
kubernetes/...` works the same against a real cluster as it does against
minikube, since you're talking to whatever cluster your current
`kubectl` context points at (`kubectl config current-context` to check).

### 3B.3 Review the Secret before any real deployment

`kubernetes/secret.yaml` ships with the same values as the original
`.env` file (so the stack works out of the box for evaluation/testing).
**Change `JWT_SECRET` and the database password before any real
production use.** You can either edit the YAML directly, or replace it
entirely with an imperative command (see the comment block inside
`secret.yaml`) so the secret values never live in version control.

### 3B.4 Access the application on a real cluster

```bash
kubectl get service kpk-citizen-portal-service -n kpk-citizen-portal
```

Look at the `PORT(S)` column, e.g. `3000:31234/TCP` — `31234` is the
NodePort. Then access the app at `http://<any-node-external-ip>:31234`
(`kubectl get nodes -o wide` for node IPs), with your cluster's
firewall/security group allowing that port.

---

## 4. Notes & production considerations

- **File uploads (`/api/upload`)** write to `public/uploads` on local
  container disk. With multiple replicas (2, by default) and no shared
  volume, an uploaded file is only visible on the pod that received the
  upload request — not the others. For real production use, either:
  - mount a shared `ReadWriteMany` PVC (e.g. NFS, EFS, Azure Files) at
    `/app/public/uploads` on the app Deployment, or
  - move file storage to an object store (S3-compatible) — this would
    require an application code change, which was intentionally **not**
    made here per your instructions to leave application logic untouched.
- **Secrets in source control:** `kubernetes/secret.yaml` is provided with
  the same demo credentials as your original `.env` for convenience. Treat
  it as a template — rotate `JWT_SECRET` and the database password, and
  avoid committing real secrets to git (use Sealed Secrets, External
  Secrets Operator, or your cloud provider's secret manager instead).
- **Database is internal-only:** `postgres-service.yaml` is `ClusterIP`,
  so PostgreSQL is reachable only from inside the cluster — it is not
  exposed externally.
- **Health checks:** the app Deployment has `readinessProbe`/`livenessProbe`
  against `GET /`. The Postgres Deployment uses `pg_isready`.

---

## 5. Autoscaling & self-healing

`kubernetes/autoscaling/` adds two resources on top of the base Deployment:

| File | What it does |
|---|---|
| `hpa.yaml` | `HorizontalPodAutoscaler` — scales the app between **2 and 6** replicas based on CPU (70%) and memory (80%) utilization. |
| `pdb.yaml` | `PodDisruptionBudget` — guarantees at least 1 app pod stays up during voluntary disruptions (node drains, cluster upgrades). |

Apply them along with everything else:

```bash
kubectl apply -f kubernetes/
kubectl apply -f kubernetes/autoscaling/
```

**Requirement:** the HPA needs the cluster's `metrics-server` add-on.

- Most managed clusters (DOKS, EKS, GKE, AKS) have it pre-installed or available as a one-click add-on.
- minikube: `minikube addons enable metrics-server`
- kind / self-managed: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`

Check it's working:

```bash
kubectl get hpa -n kpk-citizen-portal
kubectl top pods -n kpk-citizen-portal
```

**Self-healing** already comes from three layers working together: the
`livenessProbe` (restarts a pod if it stops responding), the Deployment
controller (recreates pods if they crash or a node dies), and the
`PodDisruptionBudget` above (keeps availability up during planned
disruptions). No extra setup is needed for this beyond applying the
manifests already in `kubernetes/`.

---

## 6. Observability — Prometheus & Grafana

`kubernetes/monitoring/` deploys a self-contained Prometheus + Grafana
stack (no Helm required) into its own `monitoring` namespace.

```bash
kubectl apply -f kubernetes/monitoring/
kubectl get pods -n monitoring
```

**Access Grafana** (NodePort, same pattern as the app):

```bash
kubectl get service grafana -n monitoring
```

Use the `PORT(S)` column to find the assigned NodePort, then visit
`http://<node-ip>:<nodeport>`.

- Default login: `admin` / `ChangeMe-Grafana-2026` (set in
  `kubernetes/monitoring/20-grafana.yaml` — **change this before any real
  use**, ideally by editing the Secret rather than leaving the demo
  default).
- Prometheus is already wired in as a Grafana datasource automatically —
  no manual setup needed. Open **Explore** in Grafana and query something
  like `up` or `container_memory_usage_bytes` to confirm data is flowing.

**What's actually being monitored:** cluster and pod-level metrics (CPU,
memory, restarts, network) via the Kubernetes API and kubelet/cAdvisor —
this works immediately with zero application changes. The application
itself does **not** currently expose a custom `/metrics` endpoint (since
no app code was changed, per your original instructions), so you won't
see request-rate/latency-style application metrics out of the box. To get
those, you'd add a metrics library (e.g. `prom-client`) to the app and
expose a `/metrics` route — that's an application code change you'd need
to opt into separately.

You can import community dashboards for general Kubernetes visibility —
e.g. dashboard ID `315` (Kubernetes cluster monitoring) or `747`
(Kubernetes pod) from [grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards),
via **Dashboards → Import** in the Grafana UI.

---

## 7. CI/CD — GitHub Actions

`.github/workflows/ci-cd.yml` runs on every push to `main`:

1. **`build`** — builds the Docker image (runs on PRs too, as a build-correctness check; no secrets needed).
2. **`push`** — logs into Docker Hub and pushes `latest` + a SHA-tagged image. Only runs on `main`.
3. **`deploy`** — applies the Kubernetes manifests, does a rolling `kubectl set image` update (zero-downtime, since `deployment.yaml` uses `RollingUpdate` with `maxUnavailable: 0`), waits for rollout to finish, then runs `prisma migrate deploy`. **Skips automatically** (without failing the pipeline) if cluster credentials aren't configured yet.

### Required GitHub repo secrets

Set these under **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | A Docker Hub [access token](https://hub.docker.com/settings/security) (not your password) |
| `KUBE_CONFIG` | *(optional, enables auto-deploy)* Base64-encoded kubeconfig for your cluster — see below |

Generate the `KUBE_CONFIG` value:

```bash
# macOS / Linux
cat ~/.kube/config | base64 | tr -d '\n'

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\.kube\config"))
```

Paste the output as the `KUBE_CONFIG` secret value.

Without `KUBE_CONFIG` set, the pipeline still builds and pushes images to
Docker Hub on every merge to `main` — you'd just run the `kubectl apply`/
`kubectl set image` steps manually (see Section 3 above) until you're
ready to wire up auto-deploy.

---

## 8. Infrastructure as Code — Terraform

`terraform/` provisions a managed Kubernetes cluster (DOKS) and a managed
PostgreSQL database on DigitalOcean, then creates the app's Kubernetes
namespace + Secret automatically with the real database connection
string filled in.

> **Why DigitalOcean as the example?** It needs only a single API token
> to get started, unlike AWS/GCP/Azure which require IAM roles and VPC
> design before any Kubernetes resource can be created. The same
> structure (managed K8s cluster + managed Postgres + firewall) maps onto
> equivalent resources on other clouds — see "Adapting to another cloud
> provider" below.

### 8.1 Prerequisites

- A DigitalOcean account and [API token](https://cloud.digitalocean.com/account/api/tokens)
- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5.0
- [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) (DigitalOcean CLI, used to fetch kubeconfig after provisioning)

### 8.2 Provision the infrastructure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: set do_token to your real API token, and review
# the other defaults (region, node size, etc.)

terraform init
terraform plan
terraform apply
```

This creates a 2–4 node autoscaling DOKS cluster and a managed Postgres
instance, and provisions the `kpk-citizen-portal` namespace + Secret
directly in the new cluster.

### 8.3 Connect kubectl to the new cluster

```bash
terraform output kubeconfig_command
# copy/paste the printed command, e.g.:
doctl kubernetes cluster kubeconfig save kpk-citizen-portal-cluster
```

### 8.4 Deploy the application

`kubernetes/deployment.yaml` defaults to the local minikube image (see
Section 3B) — **before applying it here, switch it to your Docker Hub
image** as described in [Section 3B.2](#3b2-point-the-deployment-at-the-docker-hub-image).

Since Terraform already created the namespace and Secret, apply only the
remaining manifests (skip `namespace.yaml` and `secret.yaml` — Terraform
owns those now):

```bash
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/autoscaling/
kubectl apply -f kubernetes/monitoring/
```

> Skip `postgres-deployment.yaml` / `postgres-pvc.yaml` / `postgres-service.yaml`
> entirely in this path — Terraform's managed database replaces the
> in-cluster Postgres. Those three files are only for local/demo clusters
> (minikube, kind) where a managed database isn't being used.

### 8.5 Tear down

```bash
cd terraform
terraform destroy
```

This deletes the cluster and the managed database. **This is
irreversible and deletes data** — make sure you have a backup/export if
needed first.

### 8.6 Adapting Terraform to another cloud provider

If you're not using DigitalOcean, swap `terraform/main.tf` and
`terraform/providers.tf` for the equivalent managed services:

| DigitalOcean (this repo) | AWS equivalent | GCP equivalent | Azure equivalent |
|---|---|---|---|
| `digitalocean_kubernetes_cluster` | `aws_eks_cluster` (+ `aws_eks_node_group`) | `google_container_cluster` | `azurerm_kubernetes_cluster` |
| `digitalocean_database_cluster` (pg) | `aws_db_instance` (RDS, engine=postgres) | `google_sql_database_instance` | `azurerm_postgresql_flexible_server` |

The `kubernetes_namespace`/`kubernetes_secret` resources at the bottom of
`main.tf` (using the `hashicorp/kubernetes` provider) stay the same
regardless of cloud, since they talk to the Kubernetes API, not the cloud
provider's API.

---

## 9. Commands that work the same on Windows, macOS, and Linux

All `docker`, `kubectl`, and `terraform` commands above are
cross-platform as written — they run identically in PowerShell, macOS
Terminal, and Linux shells. The few exceptions where syntax differs are
called out explicitly:

| Task | Notes |
|---|---|
| Setting an env var inline | Examples above set env vars via `docker-compose.yml`/Kubernetes Secrets (not shell `export`), which is OS-independent. |
| Base64-encoding kubeconfig for `KUBE_CONFIG` | Different command per OS — see Section 7 above (separate macOS/Linux and Windows PowerShell versions are given). |
| Line continuation in multi-line commands | Bash/macOS uses `\` at end of line; PowerShell uses `` ` ``. If pasting a multi-line `docker run` command into PowerShell, either join it into one line or replace trailing `\` with `` ` ``. |
| Path separators | All paths in this README use forward slashes (`kubernetes/deployment.yaml`); Windows accepts these the same way in PowerShell, Git Bash, and WSL. |

If you're on native Windows (not WSL) and a command fails specifically
due to line-continuation syntax, the simplest fix is to either install
[Git Bash](https://git-scm.com/downloads) / [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and run the bash versions
as-is, or flatten the multi-line command onto a single line.
