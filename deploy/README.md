# Bookamore — VPS Deployment Guide

> Dual-environment setup on `185.143.145.151`  
> **Prod**: `bookamore.alt-web.biz.ua` → port `4000`  
> **Dev**: `bookamore-dev.alt-web.biz.ua` → port `3000`

---

## 1. GitHub Secrets

Go to **GitHub → Repository → Settings → Secrets and variables → Actions** and add the following:

| Secret name            | Description                                                     | Example value                          |
|------------------------|-----------------------------------------------------------------|----------------------------------------|
| `VPS_HOST`             | Public IP or hostname of the VPS                                | `185.143.145.151`                      |
| `VPS_USER`             | SSH user on VPS                                                 | `devuser`                                  |
| `VPS_SSH_PRIVATE_KEY(old - VPS_SSH_KEY)`  | Private key whose public key is in `~/.ssh/authorized_keys` on VPS | `-----BEGIN OPENSSH PRIVATE KEY-----…` |
| `VPS_SSH_PORT`         | SSH port (usually 22)                                           | `22`                                   |
| `DEPLOY_REPO_SSH_URL`  | SSH clone URL of the repo                                       | `git@github.com:your-org/bookamore.git`|
| `DB_USER`              | PostgreSQL username (used for both envs)                        | `bookamore`                            |
| `DB_PASSWORD`          | PostgreSQL password (used for both envs)                        | *(strong random string)*               |
| `JWT_SECRET`           | JWT signing secret                                              | *(strong random string)*               |
| `JWT_EXPIRATION`       | JWT token lifetime in milliseconds                              | `86400000`                             |
| `GOOGLE_CLIENT_ID`     | Google OAuth2 client ID                                         | *(from Google Cloud Console)*          |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret                                     | *(from Google Cloud Console)*          |
| `FACEBOOK_CLIENT_ID`   | Facebook OAuth2 app ID                                          | *(from Meta Developer Console)*        |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth2 app secret                                    | *(from Meta Developer Console)*        |

> **Note:** `APP_NAME`, `FE_PORT`, `BE_PORT`, `DB_PORT`, `DB_NAME`, `CLIENT_URL`, and `SPRING_PROFILES_ACTIVE`
> are set automatically by the deploy workflow based on the branch (`main` or `dev`).
> You do **not** need GitHub Secrets for those.

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

Then make sure the private key is added to your GitHub Secret `VPS_SSH_PRIVATE_KEY`:

```bash
cat ~/.ssh/bookamore_deploy
```

### 2.3 Create deployment directories

```bash
sudo mkdir -p /home/devuser/deploy/bookamore-prod
sudo mkdir -p /home/devuser/deploy/bookamore-dev
sudo chown -R mrx:mrx /home/devuser/deploy
```

### 2.4 Create `.env` files for each environment

The CI workflow generates a `.env` file on every deploy. However, you must create one
**manually before the first deploy triggers** so that `docker compose` can start:

```bash
# Dev environment
cp /path/to/repo/.env.example /home/mrx/deploy/bookamore-dev/.env
nano /home/devuser/deploy/bookamore-dev/.env
```

```bash
# Prod environment
cp /path/to/repo/.env.example /home/mrx/deploy/bookamore-prod/.env
nano /home/devuser/deploy/bookamore-prod/.env
```

Fill in the sensitive values (`DB_PASSWORD`, `JWT_SECRET`, OAuth credentials) and update
the infrastructure values to match each environment:

| Variable               | Dev value                               | Prod value                           |
|------------------------|-----------------------------------------|--------------------------------------|
| `APP_NAME`             | `bookamore_dev`                         | `bookamore_prod`                     |
| `FE_PORT`              | `3000`                                  | `4000`                               |
| `BE_PORT`              | `3100`                                  | `4100`                               |
| `DB_PORT`              | `5433`                                  | `5432`                               |
| `DB_NAME`              | `bookamore_dev`                         | `bookamore_prod`                     |
| `SPRING_PROFILES_ACTIVE` | `dev`                                 | `prod`                               |
| `CLIENT_URL`           | `https://bookamore-dev.alt-web.biz.ua`  | `https://bookamore.alt-web.biz.ua`   |

> After the **first** deploy, the workflow regenerates `.env` from GitHub Secrets automatically.

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
        proxy_pass         http://127.0.0.1:4000;
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
        proxy_pass         http://127.0.0.1:3000;
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
| `main`       | Production  | `4000`        | `4100`       |
| `dev`        | Development | `3000`        | `3100`       |

The GitHub Actions workflow:
1. SSHs into the VPS.
2. `git clone` (first time) or `git reset --hard origin/<branch>` (subsequent runs).
3. Writes `.env` from GitHub Secrets.
4. Runs `docker compose --env-file .env up -d --build`.

### Useful monitoring commands on the VPS

```bash
# Check running containers for both envs
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Tail backend logs for dev
docker logs -f bookamore_dev_backend

# Tail backend logs for prod
docker logs -f bookamore_prod_backend

# Check disk usage of Docker volumes
docker system df -v
```

