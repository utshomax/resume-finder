# Resume Finder

A web application for storing and searching resumes.

## Prerequisites

- Docker and Docker Compose
- PNPM (for local development)

## Quick Start

1. Start the application:
   ```bash
   docker-compose up
   ```
   The application will be available at:
   - Frontend: http://localhost:3000
   - API: http://localhost:8080

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

## Tech Stack
- Backend: Node.js, Express, PostgreSQL, Drizzle ORM
- Frontend: React, TypeScript, TailwindCSS, Vite

## Preview
![image](https://github.com/user-attachments/assets/d94aba88-c010-4bf7-88ca-420d9296df23)
