# AGENTS.md - Development Guidelines

## Project Overview

Chinese Learning App - A React + TypeScript frontend with Go/Gin backend for kids learning Chinese characters through drawing, AI illustrations, and conversations with Bao Bao Panda.

## Build & Development Commands

### Frontend (React + TypeScript + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (no dedicated test/lint scripts configured)
npx tsc --noEmit
```

### Backend (Go + Gin + GORM)

```bash
cd backend

# Download dependencies
go mod download

# Run development server
go run main.go

# Build binary
go build -o server

# Format code
go fmt ./...

# Vet code
go vet ./...
```

### Docker Development

```bash
# Start full stack (frontend + backend + PostgreSQL)
docker-compose up --build

# Access points:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8080/api
```

### Running Single Tests

No test framework is currently configured. To add tests:
- Frontend: Add Vitest (`npm install -D vitest @testing-library/react`)
- Backend: Use Go's built-in `testing` package with `go test ./...`

## Code Style Guidelines

### TypeScript/React (Frontend)

**Imports:**
- React imports first: `import React from 'react'`
- Third-party libraries next
- Local imports using relative paths (`./components/`, `../hooks/`, `../api/`)
- CSS imports last

**Formatting:**
- 2-space indentation
- Semicolons required
- Single quotes for strings
- Trailing commas in multi-line objects/arrays
- Max line length: ~100 chars

**Types:**
- Strict mode enabled (`strict: true` in tsconfig)
- Use `React.FC<Props>` for functional components with props
- Define interfaces for component props with descriptive names ending in `Props`
- Avoid `any`; use `unknown` or proper types
- Leverage TypeScript inference where clear

**Naming Conventions:**
- Components: PascalCase (`DrawingCanvas`, `WordCard`)
- Hooks: camelCase with `use` prefix (`useDrawing`)
- Files: PascalCase for components, camelCase for utilities
- Props interface: `{ComponentName}Props`
- CSS: inline styles with style objects (no CSS modules/styled-components)

**Components:**
- Functional components only (no class components)
- Destructure props in function signature
- Use `React.RefObject` for refs
- Keep components focused on single responsibility

**Error Handling:**
- Try/catch for async operations
- Log errors with descriptive messages
- Return early on validation failures
- Use optional chaining (`?.`) for nullable values

**State Management:**
- `useState` for local component state
- `useEffect` for side effects
- `useCallback` for memoized event handlers
- `useRef` for DOM access and mutable values

### Go (Backend)

**Formatting:**
- Use `go fmt` for all files (tabs, not spaces)
- Follow standard Go project layout
- Import groups: stdlib, third-party, local packages

**Naming Conventions:**
- Exported: PascalCase (`DictionaryEntry`, `GetDictionary`)
- Unexported: camelCase (`lookupCEDICT`, `parseCEDICTLine`)
- Files: snake_case (`dictionary.go`, `bao_bao.go`)
- Packages: lowercase, match directory name

**Error Handling:**
- Return errors as last return value
- Check errors immediately with `if err != nil`
- Use `log.Fatal` for unrecoverable errors
- Use `fmt.Errorf` for custom error messages

**HTTP Handlers:**
- Use Gin framework patterns
- Validate input with `c.ShouldBindJSON()`
- Return appropriate HTTP status codes
- Use struct types for request/response bodies

**Database (GORM):**
- Use struct tags for model definitions
- Leverage GORM's automatic migrations
- Use `Preload` for eager loading associations
- Environment variables for configuration (require `DATABASE_URL`)

**Code Organization:**
- `handlers/` - HTTP request handlers
- `models/` - Data structures and GORM models
- `services/` - Business logic
- `database/` - Database connection and migrations

## Architecture Notes

**Frontend Structure:**
```
frontend/src/
  api/          - API client (axios-based)
  components/   - React components
  hooks/        - Custom React hooks
  styles/       - Global CSS
  App.tsx       - Main app component
  main.tsx      - Entry point
```

**Backend Structure:**
```
backend/
  database/     - PostgreSQL connection via GORM
  handlers/     - HTTP handlers (Gin)
  models/       - GORM models
  services/     - Business logic (Bao Bao chat, gamification)
  main.go       - Server entry point
```

## Pre-Push Checklist

**IMPORTANT: Test all builds locally before pushing to GitHub**

```bash
# Frontend - verify build succeeds
cd frontend
npm run build
npx tsc --noEmit

# Backend - verify build succeeds
cd backend
go build -o server
go fmt ./...
go vet ./...

# Only push after both builds pass
git push origin main
```

## Deployment

- CI/CD via GitHub Actions (`.github/workflows/deploy.yml`)
- Deploys to Railway on push to `main`
- Frontend served as static files from backend's `/dist` folder
- Requires `RAILWAY_TOKEN` secret for deployment

## Environment Variables

**Backend:**
- `DATABASE_URL` (required) - PostgreSQL connection string
- `PORT` (optional, default: 8080) - Server port

**Frontend:**
- No environment variables; API calls use relative paths to `/api`
