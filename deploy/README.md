# Bookamore — VPS Deployment Guide

> Dual-environment setup on `185.143.145.151`  
> **Prod**: `bookamore.alt-web.biz.ua` → port `3432`  
> **Dev**: `bookamore-dev.alt-web.biz.ua` → port `3433`

---

## 1. GitHub Secrets

Go to **GitHub → Repository → Settings → Secrets and variables → Actions** and add the following:

| Secret name   | Description                                                            | Example value                          |
|--------------|------------------------------------------------------------------------|----------------------------------------|
| `VPS_HOST`   | Public IP or hostname of the VPS                                       | `185.143.145.151`                      |
| `VPS_SSH_KEY`| Private key whose public key is in `/home/deploy/.ssh/authorized_keys` | `-----BEGIN OPENSSH PRIVATE KEY-----…` |

> **Note:** App credentials (`DB_USER`, `DB_PASSWORD`, JWT, OAuth keys) are read from
> `/home/deploy/www/dev/.env` and `/home/deploy/www/prod/.env` on the VPS.
> They are not required as GitHub Secrets in this workflow.

---

## 2. First-Time VPS Setup

SSH into the server, then run the following commands.

### 2.1 Install dependencies (if not already done)

```bash
# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# Nginx
sudo apt-get update && sudo apt-get install -y nginx

# Git
sudo apt-get install -y git
```

### 2.2 Add the deploy SSH key to GitHub

On the VPS, generate a dedicated deploy key (or reuse an existing one):

```bash
ssh-keygen -t ed25519 -C "bookamore-deploy" -f ~/.ssh/bookamore_deploy
cat ~/.ssh/bookamore_deploy.pub
```

Copy the output and add it to **GitHub → Repo → Settings → Deploy keys** (read-only access).

Then make sure the private key is added to your GitHub Secret `VPS_SSH_KEY`:

```bash
cat ~/.ssh/bookamore_deploy
```

### 2.3 Create deployment directories

```bash
sudo mkdir -p /home/deploy/www/prod
sudo mkdir -p /home/deploy/www/dev
sudo chown -R deploy:deploy /home/deploy/www
```

### 2.4 Create `.env` files for each environment

The CI workflow expects `.env` to already exist in each target directory. Create these files
**manually before the first deploy triggers** so that `docker compose` can start:

```bash
# Dev environment
cp /path/to/repo/.env.example /home/deploy/www/dev/.env
nano /home/deploy/www/dev/.env
```

```bash
# Prod environment
cp /path/to/repo/.env.example /home/deploy/www/prod/.env
nano /home/deploy/www/prod/.env
```

Fill in the sensitive values (`DB_PASSWORD`, `JWT_SECRET`, OAuth credentials) and update
the infrastructure values to match each environment:

| Variable               | Dev value                               | Prod value                           |
|------------------------|-----------------------------------------|--------------------------------------|
| `APP_NAME`             | `dev_bookamore`                         | `bookamore_prod`                     |
| `FE_PORT`              | `3433`                                  | `3432`                               |
| `BE_PORT`              | `3001`                                  | `3000`                               |
| `DB_PORT`              | `5433`                                  | `5432`                               |
| `DB_NAME`              | `bookamore_dev`                         | `bookamore_prod`                     |
| `SPRING_PROFILES_ACTIVE` | `dev`                                 | `prod`                               |
| `CLIENT_URL`           | `https://bookamore-dev.alt-web.biz.ua`  | `https://bookamore.alt-web.biz.ua`   |

> The workflow keeps env-specific routing values synchronized (`APP_NAME`, ports, profile, `CLIENT_URL`),
> while sensitive credentials stay in each VPS `.env` file.

### 2.5 Bootstrap Git repositories (one-time)

The deploy workflow updates an existing checkout in each target directory. Initialize both once:

```bash
sudo -u deploy git clone <YOUR_REPO_SSH_OR_HTTPS_URL> /home/deploy/www/prod
sudo -u deploy git clone <YOUR_REPO_SSH_OR_HTTPS_URL> /home/deploy/www/dev
```

---

## 3. Host Nginx Reverse Proxy

The host Nginx routes subdomain traffic to the correct Docker container port.

### 3.1 Create the site config

```bash
sudo nano /etc/nginx/sites-available/bookamore.conf
```

Paste the following:

```nginx
# ─── Production ──────────────────────────────────────────────────────────────
server {
    listen 80;
    server_name bookamore.alt-web.biz.ua;

    location / {
        proxy_pass         http://127.0.0.1:3432;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}

# ─── Development ─────────────────────────────────────────────────────────────
server {
    listen 80;
    server_name bookamore-dev.alt-web.biz.ua;

    location / {
        proxy_pass         http://127.0.0.1:3433;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

### 3.2 Enable and reload

```bash
sudo ln -s /etc/nginx/sites-available/bookamore.conf /etc/nginx/sites-enabled/bookamore.conf
sudo nginx -t
sudo systemctl reload nginx
```

### 3.3 Add TLS with Certbot (recommended)

```bash
sudo apt-get install -y certbot python3-certbot-nginx

sudo certbot --nginx \
  -d bookamore.alt-web.biz.ua \
  -d bookamore-dev.alt-web.biz.ua
```

Certbot rewrites the Nginx config to add HTTPS and sets up automatic renewal.
Verify auto-renewal is active:

```bash
sudo systemctl status certbot.timer
```

---

## 4. Deployment Flow

After the one-time VPS setup is complete, every deploy is fully automatic:

| Git push to… | Environment | Frontend port | Backend port |
|--------------|-------------|---------------|--------------|
| `main`       | Production  | `3432`        | `3000`       |
| `dev`        | Development | `3433`        | `3001`       |

The GitHub Actions workflow:
1. SSHs into the VPS.
2. Uses `/home/deploy/www/prod` for `main` and `/home/deploy/www/dev` for `dev`.
3. Syncs non-sensitive env routing values in `.env`.
4. Runs `docker compose -f docker-compose.yaml --env-file .env up -d --build` (prod) or `docker compose -f docker-compose.dev.yml --env-file .env up -d --build` (dev).

### Useful monitoring commands on the VPS

```bash
# Check running containers for both envs
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Tail backend logs for dev
docker logs -f dev_bookamore_backend

# Tail backend logs for prod
docker logs -f bookamore_prod_backend

# Check disk usage of Docker volumes
docker system df -v
```

