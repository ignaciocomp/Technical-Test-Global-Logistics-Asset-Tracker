# Global Logistics Asset Tracker (GLAT)

Full-stack platform for managing and monitoring logistics assets (containers, vehicles, machinery) in real time.

## Tech Stack

- **Backend:** .NET 8 / C# — Clean Architecture (Domain, Application, Infrastructure, API)
- **Database:** SQL Server 2022 (Linux container)
- **Frontend:** React 18 + Tailwind CSS + Zustand
- **Native Module:** ANSI C health-score library, integrated via P/Invoke
- **Infrastructure:** Docker + Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Linux containers enabled)
- [Git](https://git-scm.com/)

## Quick Start

```bash
git clone <repo-url>
cd <repo-folder>
docker-compose up --build
```

Wait for the output to show `Now listening on: http://+:8080` — this means both SQL Server and the API are ready.

**Services available:**

| Service    | URL                          |
|------------|------------------------------|
| API        | http://localhost:8080         |
| Swagger UI | http://localhost:8080/swagger |
| Health     | http://localhost:8080/health  |
| SQL Server | localhost:1433                |

## Authentication

All API endpoints (except `/health` and `/api/auth/token`) require a JWT Bearer token.

### Get a token

```bash
curl -X POST http://localhost:8080/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}'
```

Response:
```json
{"token": "eyJhbGci..."}
```

### Use the token

Add the header `Authorization: Bearer <token>` to all requests.

In **Swagger UI**: click the "Authorize" button at the top, paste the token value (without "Bearer " prefix), and click Authorize.

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

See `assets-api.yaml` for the full OpenAPI specification.

## Project Structure

```
├── src/
│   ├── GLAT.Domain/          # Entities, enums, repository interfaces
│   ├── GLAT.Application/     # MediatR handlers, DTOs, validators
│   ├── GLAT.Infrastructure/  # EF Core, repositories, P/Invoke bridge
│   └── GLAT.API/             # Controllers, middleware, startup
├── frontend/                 # React SPA (Vite + Tailwind + Zustand)
├── native/health-score/      # ANSI C library (compiled inside Docker)
├── docker/                   # Dockerfiles
├── assets-api.yaml           # OpenAPI 3.0.3 spec (source of truth)
├── docker-compose.yml        # One-command startup
└── AI_STRATEGY.md            # AI tooling documentation
```

## Default Credentials

| Purpose    | Username | Password     |
|------------|----------|--------------|
| API Login  | admin    | Admin123!    |
| SQL Server | sa       | Glat@2026!   |

## Stopping the Application

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

## License

Private — Technical assessment.
