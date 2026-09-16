# Dayflow HRMS - Full Stack Version

## Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3)
- Authentication: JWT + bcryptjs

## 1. Install backend
Open a terminal in `backend`:

```bash
npm install
```

## 2. Configure environment
Copy `.env.example` to `.env`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## 3. Start backend
```bash
npm start
```

Backend: `http://localhost:3000`
Health check: `http://localhost:3000/api/health`

## 4. Open frontend
The backend serves the frontend too. Open:
`http://localhost:3000/login/login.html`

You do NOT need Live Server for this version.

## Demo credentials
HR:
- Staff ID: HR001
- DOB: 1990-05-15

Employee:
- Staff ID: EMP001
- DOB: 2000-04-10

Employee:
- Staff ID: EMP002
- DOB: 1999-08-22

## API role security
- HR-only: `/api/employees`, HR attendance list, HR leave list/status, HR payroll list
- Employee-only: own attendance, own leaves, own payroll
- Login returns a JWT; protected API routes require `Authorization: Bearer <token>`.

## Notes
The database is created automatically at `backend/data/dayflow.db` on first run. Seed data is added only when the users table is empty.
