# Team Task Manager - Full Stack Assignment

A complete full-stack web app where users can create projects, invite team members, assign tasks, track progress, and manage access using Admin/Member roles.

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, Axios, React Hot Toast
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- Database: MongoDB Atlas or local MongoDB

## Features

- Signup/Login authentication
- JWT protected REST APIs
- MongoDB relationships for users, projects, members, and tasks
- Role-based access control
- Global Admin account: `abind0173@gmail.com`
- Admin can view all projects and tasks
- Project admins can edit/delete projects, add/remove members, and create/update/delete tasks
- Members can view assigned projects and update task status
- Dashboard with project counts, task status counts, overdue tasks, recent tasks, and assigned work
- API validations for auth, project, member, and task inputs
- Responsive UI for project and task management

## Folder Structure

```txt
team-task-manager/
  backend/
  frontend/
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Run App

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Login Flow

1. Create an account from the Signup page.
2. Use `abind0173@gmail.com` for the account that should become global Admin.
3. Login.
4. Create a project.
5. Add members by email.
6. Create tasks and assign them.
7. Track progress on the dashboard.

## API Summary

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

### Tasks
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard
- `GET /api/dashboard/summary`

## Notes

- The configured email `abind0173@gmail.com` is promoted to global Admin during signup, login, or authenticated API access.
- The first creator of a project becomes the project Admin.
- Members can update task status but cannot manage project members.
- Project admins have full access inside their own projects.
