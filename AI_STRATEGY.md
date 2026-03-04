# AI-Driven Development Strategy

## Tools Used

- **Cursor IDE** with Claude — primary coding assistant for implementation, debugging, and iterative development.
- **Claude.ai** (Claude Opus) — architecture planning, technical decisions, and code review before passing tasks to Cursor.

The two tools served different roles: Claude.ai was used as a "tech lead" for planning what to build and in what order, while Cursor handled the execution — writing code, running builds, and fixing errors in real time.

## How AI Was Used

All architectural decisions were made manually before any code was generated. The choice of Clean Architecture with four layers, the P/Invoke bridge pattern for the C library, the nginx reverse proxy for the frontend container, and the spec-driven development approach (OpenAPI first, then generate TypeScript types) were all planned upfront. AI implemented what was already designed, not the other way around.

AI was most productive for boilerplate-heavy tasks: Entity Framework Fluent API configuration, Dockerfile multi-stage build syntax, React component scaffolding with Tailwind classes, and MediatR command/query patterns. These are well-known patterns where the structure is predictable but typing them out manually is slow and error-prone. The time saved here was redirected toward integration work — getting P/Invoke to resolve the shared library correctly inside Docker, configuring nginx to proxy API requests between containers, and smoke-testing every endpoint end-to-end.

Every generated file was reviewed before committing. The development flow was intentionally incremental: generate one layer, build it, test it, commit, then move to the next. This caught issues early — for example, the generated `POST /telemetry` handler initially returned `TelemetryLogDto` instead of `SensorStatusDto`, which was caught during manual API testing and fixed before proceeding. TypeScript type mismatches between generated OpenAPI types and hand-written components were caught by `npm run build` and resolved immediately.

## Prompt Log

**Task:** Generate OpenAPI 3.0.3 specification
**Prompt:** "Replace the stub in assets-api.yaml with a complete OpenAPI 3.0.3 specification for the GLAT system. Include schemas for Asset, TelemetryLog, SensorStatus with all field types. Define all 8 CRUD + telemetry endpoints with proper status codes. Add JWT Bearer security scheme. After generating, audit the spec yourself for REST inconsistencies."
**Result:** Generated a ~280 line spec. Self-audit caught a missing 409 Conflict on POST and inconsistent pagination parameter naming. Both were fixed before committing.

**Task:** Clean Architecture backend scaffold
**Prompt:** "Generate the Domain layer with entities using private setters and factory methods. Then Application layer with MediatR handlers, DTOs matching the OpenAPI spec exactly, FluentValidation validators. Then Infrastructure with EF Core Fluent API, repository implementations, and P/Invoke health score service with a managed fallback."
**Result:** Built incrementally across three commits. Each layer was compiled and verified independently. The managed fallback in HealthScoreService was important — it lets the API run on Windows during development without the Linux .so file.

**Task:** ANSI C health score library
**Prompt:** "Create the health_score.c implementation using this scoring logic: start at 100, deduct 1.5 per degree outside 15-35°C, 1.0 per unit outside 50-120 pressure, 2.0 per unit above 30 vibration, clamp to 0-100. Use -ansi flag, no C99 features. Include a Makefile and test file with 4 scenarios."
**Result:** Generated clean ANSI C code. The scoring logic in the C library exactly matches the managed fallback in C# — this was verified by comparing outputs for the same inputs through both paths.

**Task:** Docker multi-stage build
**Prompt:** "Create api.Dockerfile with three stages: GCC to compile the C library, .NET SDK to publish the API, ASP.NET runtime as final. Copy the .so to /usr/local/lib and run ldconfig. Then frontend.Dockerfile: Node to build React, Nginx to serve. Add nginx.conf with /api reverse proxy to the backend container."
**Result:** First attempt had the .dockerignore excluding the frontend/ directory which broke the frontend build. Caught during `docker-compose up --build` and fixed immediately.

**Task:** React dashboard with telemetry visualization
**Prompt:** "Create AssetDetailPage with health score gauge (SVG circle, color-coded), Recharts LineChart for temperature/pressure/vibration over time, telemetry posting modal, and auto-refresh every 30 seconds. Then a Dashboard overview with stat cards, bar chart by asset type, and recently updated table."
**Result:** Generated components needed type adjustments — the generated OpenAPI enums use lowercase values while the initial code used capitalized strings. TypeScript compilation caught these mismatches and they were fixed before committing.

## Efficiency Gain

- **Estimated time without AI:** 5-7 days
- **Actual development time:** ~3 days
- **Primary time savings:** Boilerplate generation (EF Core config, Dockerfiles, React components, MediatR patterns)
- **Where time was reinvested:** P/Invoke integration and Docker shared library loading, nginx reverse proxy configuration, end-to-end smoke testing of every endpoint through Swagger UI, and verifying the full `docker-compose up` flow before each commit

**Quality gates enforced throughout:**
- `dotnet build` with 0 errors and 0 warnings after every backend change
- `npm run build` with 0 TypeScript errors after every frontend change
- `docker-compose up --build` verified before each Docker-related commit
- Every API endpoint tested manually via curl or Swagger UI
- Frontend tested in browser after each feature commit
