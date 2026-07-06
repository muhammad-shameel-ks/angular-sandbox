# Todo App

A full-stack todo application built with Angular, .NET 10, and PostgreSQL.

## Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | Angular 21               |
| Backend  | .NET 10 (ASP.NET Core)   |
| Database | PostgreSQL 16            |
| CI       | Jenkins (Docker agents)  |
| Infra    | Terraform                |

## Project Structure

```
apps/
  frontend/   Angular app (port 4200)
  backend/    ASP.NET Core Web API (port 5xxx)
infra/        Terraform configuration
Jenkinsfile   CI pipeline
docker-compose.yml  Local PostgreSQL
```

## Prerequisites

- Node.js 20+, npm 10+
- .NET SDK 10
- Docker (for the local database)

## Getting Started

### 1. Start the database

```bash
docker compose up -d
```

### 2. Run the backend

```bash
cd apps/backend
dotnet run
```

The API starts on `https://localhost:5001` (or check the console output). Migrations run automatically on startup in development.

### 3. Run the frontend

```bash
cd apps/frontend
npm install
npm start
```

Open `http://localhost:4200`.

## API

Base path: `/api/todos`

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/todos`      | List all todos     |
| POST   | `/api/todos`      | Create a todo      |
| PUT    | `/api/todos/{id}` | Update a todo      |
| DELETE | `/api/todos/{id}` | Delete a todo      |

OpenAPI docs available at `/openapi` in development.

## CI

The Jenkins pipeline builds and tests both apps using Docker agents:

1. **Build Frontend** — `npm ci && npm run build`
2. **Build Backend** — `dotnet restore && dotnet build`
3. **Test Backend** — `dotnet test`
