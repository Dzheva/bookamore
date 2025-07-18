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

