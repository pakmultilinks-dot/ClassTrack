# ClassTrack

**Face-recognition attendance management for modern classrooms.**

ClassTrack is a full-stack attendance web application for schools, colleges, academies, and classroom-based training environments. It combines a React dashboard, browser-based face descriptor generation, Express APIs, JWT authentication, student/class management, manual attendance, reports, and PDF/Excel exports.

This project is designed as a professional portfolio-ready system and a practical foundation for a production attendance platform.

## Portfolio Description

ClassTrack is a full-stack face-recognition attendance platform built with React, Vite, Tailwind CSS, Node.js, and Express. It allows admins and teachers to manage students and classes, register browser-generated face descriptors, mark attendance through webcam scanning or manual entry, and review attendance analytics from a polished dashboard. The system stores numeric face descriptors instead of raw face images and uses Euclidean distance matching on the backend. It demonstrates role-based access control, JWT authentication, reporting, export workflows, and a migration-ready backend structure.

## Key Features

- Face recognition attendance
- Student management
- Class management
- Real-time dashboard
- Manual attendance
- Attendance reports
- Export PDF/Excel
- Role-based access

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| UI and routing | React Router DOM, React Icons, Framer Motion |
| Face recognition | face-api.js |
| Charts and exports | Recharts, jsPDF, jsPDF AutoTable, xlsx |
| Backend | Node.js, Express.js |
| Authentication | JWT, bcryptjs |
| Storage | MongoDB with Mongoose |
| Config | dotenv, Vite environment variables |

## Architecture Overview

```text
Browser webcam
  |
  v
React frontend + face-api.js
  |
  | sends numeric descriptor only
  v
Express API + JWT auth + role middleware
  |
  v
MongoDB database
  |
  v
Dashboards, attendance records, reports, PDF/Excel exports
```

ClassTrack is split into two main apps:

- `classtrack-backend/` - Express API, authentication, role protection, attendance logic, reporting, and MongoDB persistence.
- `client/` - React frontend, landing page, auth screens, role dashboards, webcam scanners, management pages, reports, and exports.

## Folder Structure

```text
ClassTrack/
|-- README.md
|-- classtrack-backend/
|   |-- README.md
|   |-- package.json
|   |-- .env.example
|   |-- data/
|   |   `-- database.json
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- routes/
|       |-- utils/
|       `-- server.js
`-- client/
    |-- README.md
    |-- package.json
    |-- .env.example
    |-- public/
    |   `-- models/
    `-- src/
        |-- components/
        |-- context/
        |-- layouts/
        |-- pages/
        |-- routes/
        |-- services/
        |-- utils/
        `-- main.jsx
```

## Screenshots

Add screenshots after running the app locally.

| Screen | Placeholder |
| --- | --- |
| Landing page | `screenshots/landing.png` |
| Admin dashboard | `screenshots/admin-dashboard.png` |
| Students page | `screenshots/students.png` |
| Face registration | `screenshots/face-registration.png` |
| Attendance scan | `screenshots/attendance-scan.png` |
| Reports | `screenshots/reports.png` |

```md
![Landing page](screenshots/landing.png)
![Admin dashboard](screenshots/admin-dashboard.png)
![Attendance scan](screenshots/attendance-scan.png)
```

## Installation Guide

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/ClassTrack.git
cd ClassTrack
```

Install backend dependencies:

```bash
cd classtrack-backend
npm install
cp .env.example .env
```

Install frontend dependencies:

```bash
cd ../client
npm install
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Environment Variable Guide

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/classtrack
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Security notes:

- Do not commit `.env` files.
- Use a strong private `JWT_SECRET`.
- Do not publish real development passwords or tokens.
- Restrict `FRONTEND_URL` to trusted frontend origins in deployment.
- Use MongoDB Atlas or a trusted local MongoDB instance with database access controls enabled.

### MongoDB Setup

ClassTrack now requires MongoDB at backend startup. You can use either MongoDB Atlas or a local MongoDB server.

MongoDB Atlas:

1. Create a free/shared cluster in MongoDB Atlas.
2. Create a database user with a strong password.
3. Allow your current IP address in Network Access.
4. Copy the connection string and set it as `MONGO_URI` in `classtrack-backend/.env`.
5. Replace the database name with `classtrack`.

Local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/classtrack
```

## Running Backend

```bash
cd classtrack-backend
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Running Frontend

```bash
cd client
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may choose another port. Update backend `FRONTEND_URL` to match the active frontend origin.

## Build Frontend

```bash
cd client
npm run build
npm run preview
```

The production build is generated in:

```text
client/dist/
```

## Demo Credentials

Use placeholder demo credentials only. Create demo users locally through the register page or the auth API.

```text
Admin Demo
Email: admin@example.com
Password: replace-with-local-demo-password

Teacher Demo
Email: teacher@example.com
Password: replace-with-local-demo-password

Student Demo
Email: student@example.com
Password: replace-with-local-demo-password
```

Do not publish real passwords from development.

## API Overview

Base URL:

```text
http://localhost:5000/api
```

| Area | Endpoints |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Students | `GET /students`, `POST /students`, `GET /students/:id`, `PUT /students/:id`, `DELETE /students/:id` |
| Classes | `GET /classes`, `POST /classes`, `GET /classes/:id`, `PUT /classes/:id`, `DELETE /classes/:id` |
| Face data | `POST /face/register/:studentId`, `GET /face/status/:studentId`, `DELETE /face/remove/:studentId` |
| Attendance | `POST /attendance/scan-face`, `POST /attendance/manual`, `GET /attendance`, `GET /attendance/student/:studentId`, `GET /attendance/class/:classId` |
| Reports | `GET /reports/summary`, `GET /reports/student/:studentId`, `GET /reports/class/:classId`, `GET /reports/low-attendance?below=75` |

Protected endpoints require:

```text
Authorization: Bearer <jwt_token>
```

## Face Recognition Flow

1. The browser opens the webcam on the frontend.
2. `face-api.js` detects the visible face in the browser.
3. `face-api.js` generates a numeric face descriptor.
4. The frontend sends the descriptor array to the backend.
5. The backend stores the descriptor, not the actual image.
6. During attendance scanning, the backend compares the submitted descriptor with saved descriptors using Euclidean distance.
7. Attendance is marked when a matching student is found within the configured matching threshold.

This keeps the face workflow descriptor-based and avoids storing raw webcam images as attendance data.

## Testing Guide

Backend:

```bash
cd classtrack-backend
npm install
npm test
npm start
```

Backend tests use Jest and Supertest. They import the Express app directly from `src/app.js`, and the auth tests reset `classtrack-backend/data/test-database.json` before each test run.

Frontend build:

```bash
cd client
npm run build
```

Manual QA checklist:

- Register a local admin account.
- Login and confirm the dashboard loads.
- Create a class.
- Create a student.
- Register a face descriptor for the student.
- Mark attendance using webcam scan.
- Mark attendance manually.
- Open reports and export PDF/Excel files.
- Test role-based navigation with admin, teacher, and student accounts.
- Confirm protected routes redirect to login when signed out.

## JSON to MongoDB Migration

Earlier demo builds stored data in:

```text
classtrack-backend/data/database.json
```

That file is now only a migration source. After setting `MONGO_URI`, migrate existing demo data with:

```bash
cd classtrack-backend
npm run migrate:json
```

The backend runtime uses MongoDB, not the JSON file.

## Future Improvements

- Add automated backend and frontend test suites.
- Add audit logs for attendance changes.
- Add timetable and session management.
- Add institution/branch management.
- Add password reset email integration.
- Add stricter face enrollment quality checks.
- Add production deployment configuration.

## License

This project currently uses the ISC license in package metadata. Add a repository-level `LICENSE` file before publishing under a final license.
