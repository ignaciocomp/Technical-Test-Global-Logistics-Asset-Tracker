# Global Logistics Asset Tracker (GLAT)

Full-stack platform for managing and monitoring logistics assets (containers, vehicles, machinery) in real time.

## Tech Stack

- **Backend:** .NET 8 / C# — Clean Architecture
- **Database:** SQL Server (Docker)
- **Frontend:** React 18 + Tailwind CSS + Zustand
- **Native Module:** ANSI C health-score library (P/Invoke)
- **Infrastructure:** Docker + Docker Compose

## Quick Start

> Setup instructions will be added as components are implemented.

## Project Structure

```
├── src/
│   ├── GLAT.Domain/          # Entities, enums, domain interfaces
│   ├── GLAT.Application/     # Use cases, DTOs, service contracts
│   ├── GLAT.Infrastructure/  # EF Core, repositories, P/Invoke
│   └── GLAT.API/             # Controllers, middleware, config
├── frontend/                 # React SPA
├── native/health-score/      # ANSI C library
├── docker/                   # Dockerfiles
├── assets-api.yaml           # OpenAPI spec (source of truth)
└── docker-compose.yml
```

## License

Private — Technical assessment.
