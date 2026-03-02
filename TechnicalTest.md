# Technical Test: Global Logistics Asset Tracker (GLAT) - L3 2026

*Created by: Architects Team @ lexart.tech ~ 2026*

---

## Objetivo

Una compañía de logística internacional necesita una plataforma para gestionar y monitorear sus activos (contenedores, vehículos y maquinaria) en tiempo real. Debido a que el sistema será consumido por múltiples plataformas (Web, Mobile y Partners Externos), la empresa ha decidido adoptar un enfoque **Spec-Driven Development (SDD)**.

El objetivo es asegurar que la API sea el contrato único de verdad antes de proceder con cualquier implementación de código. Además, se busca maximizar la eficiencia utilizando herramientas de IA para la generación de código, documentación y pruebas.

---

## Escenario

Debes desarrollar una solución Full Stack que permita el ciclo de vida completo de los activos, incluyendo un módulo de bajo nivel para procesamiento de telemetría.

---

### Parte 1: The "Source of Truth"

Antes de codificar, debes definir el contrato:

- **OpenAPI/Swagger:** Crea un archivo `assets-api.yaml` que defina los endpoints para el CRUD de activos y logs de telemetría.
- **Contrato de Datos:** Define esquemas claros para `Asset`, `TelemetryLog` y `SensorStatus`.
- **Validación de IA:** Utiliza una IA para auditar tu especificación buscando inconsistencias en los códigos de respuesta HTTP o estándares RESTful.

---

### Parte 2: Implementación Backend (.NET)

- **Generación de Código:** Utiliza la especificación de la Fase 1 para generar automáticamente los controladores y DTOs (ej. usando NSwag o Microsoft.aspnetcore.openapi).
- **Arquitectura:** Implementar Clean Architecture o Hexagonal.
- **Persistencia:** SQL Server, Oracle o MongoDB (debe estar en un contenedor).
- **Low Level Component (ANSI C):** Desarrollar una pequeña librería en ANSI C que calcule un "Health Score" basado en datos de sensores. El backend en C# debe invocar esta librería mediante P/Invoke.

---

### Parte 3: Implementación Frontend (React / Angular / Blazor)

- **API Client:** El cliente de servicios debe ser generado automáticamente a partir del archivo `assets-api.yaml`.
- **Dashboard:** Interfaz moderna que visualiza el estado de los activos y alertas de mantenimiento.
- **Responsive:** Debe ser totalmente funcional en resoluciones móviles y desktop.

---

## Requerimientos técnicos y funcionales

### Backend

- .NET 8+ (Core) con C#
- Entity Framework Core o Dapper
- Módulo en ANSI C (Compilable en entorno Linux/GCC)
- Autenticación JWT

### Frontend

- React 18+, Angular 16+ o Blazor WebAssembly
- Gestión de estado robusta (Zustand, Redux o NgRx)
- Tailwind CSS o Material UI

### DevOps & Infrastructure

- **Docker & Docker Compose:** Todo el ecosistema debe subir con un solo comando.
- **Linux Containers:** La API y la DB deben correr sobre imágenes de Linux.

---

## AI-Driven Development Guidelines

Se evaluará activamente cómo integras la IA en tu flujo de trabajo. Debes documentar lo siguiente en un archivo `AI_STRATEGY.md`:

1. **Herramientas utilizadas:** (ej. GitHub Copilot, Cursor, ChatGPT, Claude)
2. **Prompt Log:** Ejemplos de prompts utilizados para generar la especificación, refactorizar código complejo o crear el Dockerfile.
3. **Efficiency Gain:** Una breve reflexión sobre cuánto tiempo ahorraste gracias a la IA y cómo garantizaste la calidad del código generado.

---

## Deliverables

1. **Repositorio de código público:** Git con historial de commits limpios.
2. **Spec File:** `assets-api.yaml` en la raíz.
3. **Documentación:** `README.md` (Instrucciones de Setup) y `AI_STRATEGY.md`.
4. **Docker Compose:** Archivo funcional para levantamiento local.

---

## ⚠️ CRITICAL NOTE ON README.md AND TEST EXECUTION

Los evaluadores seguirán las instrucciones del `README.md` de forma literal. Si el sistema no compila o los contenedores no inician correctamente siguiendo exclusivamente los pasos documentados, **la prueba será invalidada sin proceder a la revisión de código.**