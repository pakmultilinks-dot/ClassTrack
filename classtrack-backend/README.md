# ClassTrack Backend

Express API for the ClassTrack face-recognition attendance system.

## Overview

The backend provides JWT authentication, role-based access control, student and class management, face descriptor storage, attendance marking, and report APIs. It now uses MongoDB with Mongoose for runtime persistence.

## Tech Stack

- Node.js
- Express.js
- JWT
- bcryptjs
- MongoDB
- Mongoose
- dotenv
- cors

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/classtrack
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Security notes:

- Do not commit `.env`.
- Use a strong `JWT_SECRET`.
- Set `FRONTEND_URL` to the deployed frontend origin.
- Set `MONGO_URI` to a MongoDB Atlas connection string or a local MongoDB URI.
- Use placeholder demo credentials in documentation only.

## MongoDB Setup

ClassTrack requires MongoDB before the backend starts.

MongoDB Atlas:

1. Create a cluster.
2. Create a database user.
3. Allow your IP address in Network Access.
4. Copy the connection string.
5. Add it to `.env` as `MONGO_URI`.

Local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/classtrack
```

## Scripts

```bash
npm run dev
npm start
npm run migrate:json
npm test
npm run test:watch
```

## Automated Tests

The backend uses Jest and Supertest for API tests.

Install dependencies:

```bash
npm install
```

Run the test suite:

```bash
npm test
```

Run tests in watch mode while developing:

```bash
npm run test:watch
```

Tests import `src/app.js` directly, so they do not start a duplicate HTTP server. Under `NODE_ENV=test`, auth tests use an isolated local test database file:

```text
data/test-database.json
```

The helper in `tests/setupTestDb.js` resets that file before each test.

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

Protected routes require:

```text
Authorization: Bearer <jwt_token>
```

## Face Descriptor Storage

The backend stores numeric face descriptors generated in the browser by `face-api.js`. It does not store raw face images. During attendance scanning, submitted descriptors are compared with stored descriptors using Euclidean distance.

## JSON Migration Helper

Older local-demo builds stored data in:

```text
data/database.json
```

After MongoDB is configured, migrate that data into MongoDB with:

```bash
npm run migrate:json
```

The backend no longer reads `data/database.json` during normal API requests.
