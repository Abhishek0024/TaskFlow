# TaskFlow

TaskFlow is a full-stack project and task management application with role-based access for admins and members. It includes a retro-brutalist React frontend, a Spring Boot backend, JWT authentication, project membership controls, Kanban task boards, and filtered activity logs.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router, Axios, lucide-react, dnd-kit
- Backend: Spring Boot 4, Spring Security, Spring Data JPA, JWT, Lombok
- Database: PostgreSQL

## Project Structure

```text
TaskFlow/
  taskflow-backend/     Spring Boot API
  taskflow-frontend/    React/Vite client
  Plan.txt              Original implementation notes
```

## Features

- Email/password authentication with JWT
- Signup and login flows
- Role-based UI and API access for `ADMIN` and `MEMBER`
- Admin project creation and deletion
- Admin member assignment through a dropdown modal
- Member project visibility limited to assigned projects
- Kanban task board with drag-and-drop status updates
- Member task metrics based on assigned work
- Admin dashboard metrics across the full system
- Activity logs filtered by role

## Role Behavior

### Admin

- Sees all projects and system-wide dashboard statistics
- Can create and delete projects
- Can add members to projects
- Can view all project boards
- Sees global activity logs

### Member

- Sees only projects they have been added to
- Cannot create or delete projects
- Cannot manage project members
- Can create tasks inside assigned projects
- Can move tasks on assigned project boards
- Sees activity only for projects they belong to

## Backend Setup

The backend expects PostgreSQL to be running locally.

Default database settings are in `taskflow-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskflow
spring.datasource.username=postgres
spring.datasource.password=Admin
spring.jpa.hibernate.ddl-auto=update
```

Create the database if it does not exist:

```sql
CREATE DATABASE taskflow;
```

Run the backend:

```bash
cd taskflow-backend
mvn.cmd spring-boot:run
```

Run backend tests:

```bash
cd taskflow-backend
mvn.cmd test
```

The backend runs on:

```text
http://localhost:8080
```

## Frontend Setup

Install dependencies:

```bash
cd taskflow-frontend
npm install
```

Run the frontend:

```bash
cd taskflow-frontend
npm.cmd run dev
```

Build the frontend:

```bash
cd taskflow-frontend
npm.cmd run build
```

Run lint:

```bash
cd taskflow-frontend
npm.cmd run lint
```

The frontend runs on:

```text
http://localhost:5173
```

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Projects

- `GET /projects`
- `POST /projects` admin only
- `DELETE /projects/{projectId}` admin only
- `POST /projects/{projectId}/members/{userId}` admin only

### Users

- `GET /users/members` admin only

### Tasks

- `GET /tasks/project/{projectId}`
- `POST /tasks`
- `PUT /tasks/{taskId}/status?status=TODO|IN_PROGRESS|DONE`

### Activity

- `GET /activity/recent`

## Local Development Notes

- The frontend stores the JWT and user object in `localStorage`.
- The backend uses `spring.jpa.hibernate.ddl-auto=update`, so new tables are created automatically during development.
- CORS is configured for `http://localhost:5173`.
- Members only receive data for projects where they are listed in `project_members`.

## Verification Commands

Use these before handing off changes:

```bash
cd taskflow-backend
mvn.cmd test
```

```bash
cd taskflow-frontend
npx.cmd eslint src
npm.cmd run build
```
