# GLAT — Global Logistics Asset Tracker

Full-stack platform for managing and monitoring logistics assets (containers, vehicles, machinery) in real time. Tracks sensor telemetry, computes health scores via a native C library, and surfaces alerts through a React dashboard.

## Tech Stack

| Layer        | Technology                                           |
|--------------|------------------------------------------------------|
| Backend      | .NET 8 / C# — Clean Architecture                    |
| Database     | SQL Server 2022 (Linux container)                    |
| Frontend     | React 18 + TypeScript + Tailwind CSS + Zustand       |
| Charts       | Recharts                                             |
| Native       | ANSI C health-score library, integrated via P/Invoke |
| API Contract | OpenAPI 3.0.3 (spec-driven development)              |
| Infra        | Docker + Docker Compose + Nginx reverse proxy        |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running, with Linux containers enabled)
- [Git](https://git-scm.com/)
- Ports **1433**, **8080**, and **3000** free

## Quick Start

```bash
git clone https://github.com/ignaciocomp/Technical-Test-Global-Logistics-Asset-Tracker.git
cd Technical-Test-Global-Logistics-Asset-Tracker
docker-compose up --build
```

First build takes **3-5 minutes** (downloads base images for .NET, Node, GCC, Nginx, SQL Server).

Wait for the logs to show `Now listening on: http://+:8080` — all three services are then ready.

## Service URLs

| Service      | URL                            |
|--------------|--------------------------------|
| **Frontend** | http://localhost:3000           |
| Swagger UI   | http://localhost:8080/swagger   |
| API          | http://localhost:8080           |
| Health Check | http://localhost:8080/health    |
| SQL Server   | localhost:1433                  |

## Default Credentials

| Purpose    | Username | Password     |
|------------|----------|--------------|
| App Login  | admin    | Admin123!    |
| SQL Server | sa       | Glat@2026!   |

## Authentication

All API endpoints (except `/health` and `/api/auth/token`) require a JWT Bearer token.

**Get a token:**

```bash
curl -X POST http://localhost:8080/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}'
```

**In Swagger UI:** click "Authorize", paste the token value (without the "Bearer " prefix), click Authorize.

**In the frontend:** just log in at http://localhost:3000 — the token is handled automatically.

## API Endpoints

| Method | Path                           | Description                |
|--------|--------------------------------|----------------------------|
| POST   | /api/auth/token                | Get JWT token              |
| GET    | /api/assets                    | List assets (paginated)    |
| POST   | /api/assets                    | Create asset               |
| GET    | /api/assets/{id}               | Get asset by ID            |
| PUT    | /api/assets/{id}               | Update asset               |
| DELETE | /api/assets/{id}               | Delete asset               |
| POST   | /api/assets/{id}/telemetry     | Submit telemetry reading   |
| GET    | /api/assets/{id}/telemetry     | Get telemetry history      |
| GET    | /api/assets/{id}/status        | Get sensor status + health |

See `assets-api.yaml` for the full OpenAPI 3.0.3 specification.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│              Nginx :3000 → proxy /api → :8080            │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    GLAT.API (:8080)                       │
│          Controllers · JWT Auth · Middleware              │
├──────────────────────────────────────────────────────────┤
│                  GLAT.Application                         │
│       MediatR Handlers · DTOs · Validators               │
├──────────────────────────────────────────────────────────┤
│                  GLAT.Infrastructure                      │
│     EF Core · Repositories · P/Invoke Health Score       │
├──────────────────────────────────────────────────────────┤
│                    GLAT.Domain                            │
│          Entities · Enums · Repository Interfaces         │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   SQL Server (:1433)    │
              └─────────────────────────┘
              ┌─────────────────────────┐
              │  libhealth_score.so     │
              │  ANSI C · GCC · Linux   │
              └─────────────────────────┘
```

The C library is compiled from source inside Docker (GCC 12), produces a shared object, and is called from C# via P/Invoke at runtime. A managed fallback exists if the native library is unavailable.

## Project Structure

```
├── src/
│   ├── GLAT.Domain/            # Entities, enums, value objects, repository interfaces
│   ├── GLAT.Application/       # MediatR commands/queries, DTOs, validators, mapper
│   ├── GLAT.Infrastructure/    # EF Core DbContext, repositories, P/Invoke bridge
│   └── GLAT.API/               # Controllers, JWT auth, exception middleware, Program.cs
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios client, generated types, API functions
│   │   ├── components/         # Layout, ProtectedRoute, modals, gauge, chart
│   │   ├── pages/              # Login, Assets, AssetDetail, Dashboard
│   │   └── store/              # Zustand stores (auth, assets)
│   └── .env                    # VITE_API_URL for local dev
├── native/health-score/        # ANSI C library (header, impl, Makefile, tests)
├── docker/
│   ├── api.Dockerfile          # Multi-stage: GCC → .NET SDK → ASP.NET runtime
│   ├── frontend.Dockerfile     # Multi-stage: Node build → Nginx
│   └── nginx.conf              # SPA routing + /api reverse proxy
├── assets-api.yaml             # OpenAPI 3.0.3 spec (source of truth)
├── docker-compose.yml          # 3 services: sqlserver, api, frontend
├── AI_STRATEGY.md              # AI tooling documentation
└── README.md
```

## Stopping the Application

```bash
docker-compose down
```

To also remove the database volume (wipes all data):

```bash
docker-compose down -v
```

## License

Private — Technical assessment.
