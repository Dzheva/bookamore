# bookamore

---
# Repository Workflow Guidelines

---
## 1. General worklow
Follow these steps:

1.  **Pull Latest:** Always start by pulling the latest changes from `main`.
    ```bash
    git pull origin main
    ```

2.  **New Branch:** Create a branch for each task, named after its task ID.
    ```bash
    git branch [TASK_ID]
    ```
    *Example: `git branch TFF-001`*

3.  **Checkout Branch:** Switch to your new branch.
    ```bash
    git checkout [TASK_ID]
    ```

4.  **Stage Changes:** Stage all your modifications.
    ```bash
    git add .
    ```

5.  **Commit Work:** Commit with a message including the task ID and a brief description.
    ```bash
    git commit -m "[TASK_ID] - [DESCRIPTION]"
    ```
    *Example: `git commit -m "TFF-001 - add login page"`*

6.  **Push Branch:** Push your branch to the remote repository.
    ```bash
    git push origin [TASK_ID]
    ```

7.  **Create Pull Request (PR):** Go to GitHub (or your platform) and create a PR to `main`. The PR title should match your main commit message.

8.  **Get PR Approved:** A team member must approve your PR.
    * **Frontend PRs** (`TFF-XXX`) approved **only by frontend team**.
    * **Backend PRs** (`TFB-XXX`) approved **only by backend team**.

9.  **Merge into `main`:** Once approved, merge your changes.

10. **Repeat:** Start again from step 1 for your next task.

---
## 2. Branch Naming

Every branch name must directly link to the **task ID** it's associated with.

* **Examples:**
    * **Frontend:** `TFF-001` (task for frontend  ID 001)
    * **Backend:** `TFB-002` (task for backend ID 002)

---
## 3. Commit Naming

Each commit message should clearly describe the changes and tie back to the task ID.

* **Format:** `[TASK_ID] - [CONCISE_FEATURE_DESCRIPTION/CHANGE]`

* **Examples:**
    * **Frontend:** `TFF-001 - add login page`
    * **Backend:** `TFB-002 - add auth endpoint`

---
## 4. Pull Request Naming

The Pull Request (PR) title must be **identical to the name of the main commit** in your branch. This keeps everything consistent and clear.

* **Format:** `[MAIN_COMMIT_NAME_IN_BRANCH]`

* **Examples:**
    * If your branch's main commit is named `TFF-001 - add login page`, then the PR should also be named: `TFF-001 - add login page`
    * If your branch's main commit is named `TFB-002 - add auth endpoint`, then the PR should also be named: `TFB-002 - add auth endpoint`
---
# Docker Compose Project Setup

---

**Prerequisites**
- Docker installed on your system
- Docker Compose installed

Before starting the containers:
***make sure your system doesn't have any services using the ports specified in docker-compose file***
* You can check port usage with:
```
netstat -tuln | grep <PORT>
# or on Windows:
netstat -ano | findstr :<PORT>
```
---
### Basic Commands

* **Start Services**
```bash
docker-compose up
```
* **Start Services in detached mode (run in background)**
```bash
docker-compose up -d
```
* **Start Services with force rebuild images**
```bash
docker-compose up --build
```
* **Start Services with custom compose file**
```bash
docker-compose up -f <file>
```

* **Stop Services**
```bash
docker-compose down
```
* **Stop Services & remove attached volumes**
```bash
docker-compose down -v
```
* **Stop Services & remove all cached images**
```bash
docker-compose down --rmi all
```

* **Check container status**
```bash
docker ps
```

* **Access a container**
    * Replace  `<CONTAINER_NAME>` with your actual container name
```bash
docker exec -it <CONTAINER_NAME> bash
```

---
## Profile 'Local'

This guide explains how to manage the Docker containers using the development configuration.

* **Start the containers**
1. To build and start all services:
```bash
docker-compose -f ./docker-compose-local.yaml up --build
```
2. To build and start all services in detached mode:
```bash
docker-compose -f ./docker-compose-local.yaml up --build -d
```

* **Stop the containers**
```bash
docker-compose -f ./docker-compose-local.yaml down -v
```

* **Apply configuration changes and restart the local stack**
```bash
docker-compose -f ./docker-compose-local.yaml down
docker-compose -f ./docker-compose-local.yaml up -d --build
```

Use this sequence after changes to `nginx-local.conf` or service dependencies so Docker Compose recreates the containers with the updated startup order and Nginx runtime DNS settings.
---

## Required Local Files

To successfully build and run the project, some files must be created manually because they are **not stored in the repository**.

#### Backend

**.ENV**

location **`backend/src/main/resources/`**
- copy example
```bash
cp backend/src/main/resources/.env.example backend/src/main/resources/.env
```
- copy and edit origin
```bash
cp backend/src/main/resources/.env.origin backend/src/main/resources/.env
nano backend/src/main/resources/.env
```

<!-- Add required configuration files here -->

---

## Google OAuth2 Setup

`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` come from a Google Cloud Console OAuth 2.0 Client
(type *Web application*). Two things must be registered there, per environment:

**Authorized redirect URIs** — the Spring callback, `{origin}/login/oauth2/code/google`:

| Environment | URI |
|---|---|
| Local Docker | `http://localhost:8080/login/oauth2/code/google` |
| Dev | `https://bookamore-dev.alt-web.biz.ua/login/oauth2/code/google` |
| Prod | `https://bookamore.alt-web.biz.ua/login/oauth2/code/google` |

**Authorized JavaScript origins** — the same origins without a path.

`CLIENT_URL` must point at the origin the browser uses. When it holds a comma-separated list
(it doubles as the CORS allow-list), OAuth2 redirects use the **first** entry, so keep the
environment's own origin first.

The flow only works behind Nginx, since Google will not redirect to the bare Vite dev server:
use `docker-compose-local.yaml` rather than `npm run dev` to exercise social login locally.

---

### File Naming Conventions

Some configuration files are not committed to the repository.  
To make setup easier, use the following file naming conventions:

- **`file_name`** — the actual configuration file (not stored in the repository)
- **`file_name.origin`** — a template file with required keys but no values
- **`file_name.example`** — a sample file preconfigured for running the application with the `local` and `dev` profiles  

---
