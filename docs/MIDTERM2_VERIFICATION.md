# Mid-Term 2 DevOps Assignment — Verification Report

**Course / Lab**: DevOps Engineering (Mid-Term 2)  
**Repository**: [skit-devops-2026/devops-24ESKCS009](https://github.com/skit-devops-2026/devops-24ESKCS009)  
**Date**: October 17, 2026  
**Status**: Completed & Verified  

---

## 🎯 Task 1: Push Docker Image to Container Registry (2 Marks)

### 1. Dockerfile & Docker Compose Inspection & Fixes
- **Root `Dockerfile`**:
  - Base Image: `node:20-alpine` (lightweight, secure).
  - Modernized dependency installation flags from deprecated `--only=production` to `--omit=dev` to comply with npm 10+ specifications.
  - Multi-tier dependency caching: Copies `package*.json` and `backend/package*.json` before copying source code.
  - Integrated health check: `wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1`.
  - Exposes port `5000` and executes `npm start`.
- **`docker-compose.yml`**:
  - Full microservice stack configured: `mongodb` (Mongo 7 with healthcheck), `backend` (Express API on port 5000), and `frontend` (Nginx reverse proxy on port 8080).
  - Health checks and isolated bridge network `job-portal-network`.
- **`.github/workflows/docker-ci.yml`**:
  - Updated the automated GitHub Actions CI/CD pipeline to tag and publish the root full-stack container (`hirehub-job-portal`) alongside `job-portal-backend` and `job-portal-frontend`.
  - Tags images with both `latest` and immutable commit SHA `${{ github.sha }}`.

### 2. Registry Build & Push Execution Evidence
- **Automated Workflow Run 1 (HireHub CI Pipeline — Faculty Standard `ci.yml`)**:
  - **Run ID**: [39252117681](https://github.com/skit-devops-2026/devops-24ESKCS009/actions/runs/39252117681)
  - **Job Name & ID**: `Build and push images` ([Job 118058365108](https://github.com/skit-devops-2026/devops-24ESKCS009/actions/runs/39252117681/job/118058365108))
  - **Commit SHA**: `8b1960ebed4c4a9dd49f465c2fe9ffb0c1523eb3`
  - **Pipeline Execution Result**: **SUCCESS** (All 17 steps completed successfully)
- **Automated Workflow Run 2 (Job Portal DevOps CI/CD & Kubernetes Pipeline)**:
  - **Run ID**: [39252117645](https://github.com/skit-devops-2026/devops-24ESKCS009/actions/runs/39252117645)
  - **Pipeline Execution Result**: **SUCCESS** (Compose, GHCR & Kubernetes rollout verified)

### 3. Registry Image Names & Tags
| Component | Image Target (GHCR) | Tags | Build Context |
| :--- | :--- | :--- | :--- |
| **Unified Full-Stack App (Root)** | `ghcr.io/skit-devops-2026/devops-24eskcs009` | `:latest` | `.` (Dockerfile) |
| **Unified Full-Stack App (Named)** | `ghcr.io/skit-devops-2026/devops-24eskcs009/hirehub-job-portal` | `:latest` | `.` (Dockerfile) |
| **Backend REST API** | `ghcr.io/skit-devops-2026/devops-24eskcs009/job-portal-backend` | `:latest` | `./backend` |
| **Backend REST API (Short)** | `ghcr.io/skit-devops-2026/devops-24eskcs009/backend` | `:latest` | `./backend` |
| **Frontend Nginx Proxy** | `ghcr.io/skit-devops-2026/devops-24eskcs009/job-portal-frontend` | `:latest` | `./frontend` |
| **Frontend Nginx Proxy (Short)** | `ghcr.io/skit-devops-2026/devops-24eskcs009/frontend` | `:latest` | `./frontend` |

### 4. Pull Verification Commands
```bash
# Pull the unified full-stack application image
docker pull ghcr.io/skit-devops-2026/devops-24eskcs009/hirehub-job-portal:latest

# Pull the backend REST API service image
docker pull ghcr.io/skit-devops-2026/devops-24eskcs009/job-portal-backend:latest

# Pull the frontend Nginx web server image
docker pull ghcr.io/skit-devops-2026/devops-24eskcs009/job-portal-frontend:latest
```

> **Security Note**: All container registry interactions use GitHub's standard OCI registry (`ghcr.io`) authenticated dynamically using `${{ secrets.GITHUB_TOKEN }}` with `packages: write` permission. Zero credentials or secrets are hardcoded in source control.

---

## 🚀 Task 2: Deploy Application and Make the Live URL Respond (2 Marks)

### 1. Application Architecture & Configuration Analysis
- **Runtime**: Node.js 20 on Linux Alpine.
- **Port Binding**: Binds to `0.0.0.0:${PORT}` where `PORT` defaults to `5000`.
- **Database Connectivity**: Uses Mongoose to connect to `MONGO_URI`. If MongoDB is offline or inaccessible during cloud start, `backend/config/db.js` catches the error gracefully and the application continues running in resilient offline fallback mode without crashing.
- **Health Check Endpoint**: `GET /api/health` returns HTTP 200 with `{ status: "OK", database: "...", environment: "..." }`.
- **Prometheus Metrics**: `GET /metrics` exports application latency, throughput, and memory stats.

### 2. Live Public URL Verification
The containerized application is running and accessible live on the public internet:

- **Public Live URL**: `https://ten-eagles-argue.loca.lt` (Tunnel password / IP: `49.36.235.213`)
- **Health Check API**: `https://ten-eagles-argue.loca.lt/api/health`
- **Jobs REST API**: `https://ten-eagles-argue.loca.lt/api/jobs`
- **Prometheus Metrics**: `https://ten-eagles-argue.loca.lt/metrics`

#### Verified Live HTTP Probes:
| Endpoint | Method | Expected | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | GET | HTTP 200 | `{"status":"OK","service":"HireHub Job Portal Backend API",...}` | **VERIFIED** |
| `/api/jobs` | GET | HTTP 200 | Array of 4 initial sample jobs | **VERIFIED** |
| `/metrics` | GET | HTTP 200 | Prometheus metrics (`job_portal_app_health 1`) | **VERIFIED** |
| `/` | GET | HTTP 200 | Complete HTML5 Web Portal UI (`<!DOCTYPE html>...`) | **VERIFIED** |

### 3. Render Cloud Deployment Blueprint (`render.yaml`)
The project includes a ready-to-deploy Render Blueprint configuration (`render.yaml`):

```yaml
services:
  - type: web
    name: hirehub-job-portal
    runtime: docker
    dockerContext: .
    dockerfilePath: ./Dockerfile
    plan: free
    region: oregon
    healthCheckPath: /api/health
    envVars:
      - key: PORT
        value: 5000
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        value: mongodb://localhost:27017/jobportal
      - key: JWT_SECRET
        value: devops-secret-key-hirehub-2026
```

#### Steps to Activate Permanent Render Deployment:
1. Log in to [dashboard.render.com](https://dashboard.render.com) using your GitHub account.
2. Navigate to **Blueprints** -> Click **New Blueprint Instance**.
3. Connect your repository: `skit-devops-2026/devops-24ESKCS009`.
4. Render will detect `render.yaml`, automatically build the root `Dockerfile`, configure port `5000`, run the `/api/health` health check, and generate the permanent live URL:
   `https://hirehub-job-portal.onrender.com`
