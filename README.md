# Resume Finder

A web application for storing and searching resumes.

## Prerequisites

- Docker and Docker Compose
- PNPM (for local development)

## Quick Start

1. Clone the repository
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
3. Start the application:
   ```bash
   docker-compose up
   ```
   The application will be available at:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

## Development Setup

1. Install dependencies:
   ```bash
   pnpm install
   cd frontend && pnpm install
   ```

2. Start the development servers:
   ```bash
   # Start backend
   pnpm dev

   # In another terminal, start frontend
   cd frontend && pnpm dev
   ```