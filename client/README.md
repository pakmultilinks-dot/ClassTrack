# ClassTrack Frontend

React frontend for the ClassTrack face-recognition attendance system.

## Overview

The frontend includes the landing page, authentication UI, role-based dashboards, student/class management, face registration, attendance scanning, manual attendance, reports, PDF/Excel exports, profile, and settings screens.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- React Icons
- Axios
- face-api.js
- Recharts
- jsPDF and jsPDF AutoTable
- xlsx

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
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not commit `.env`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Main Screens

- Landing page
- Login/register/forgot password
- Admin dashboard
- Teacher dashboard
- Student dashboard
- Student management
- Class management
- Face registration
- Attendance scan
- Manual attendance
- Reports and exports
- Profile and settings

## Face Recognition Flow

1. The browser opens the webcam.
2. `face-api.js` loads models from `public/models`.
3. The browser generates a numeric face descriptor.
4. The frontend sends the descriptor to the backend.
5. The backend stores or compares the descriptor.

Raw face images are not stored by this attendance flow.

## Build

```bash
npm run build
```

The production build is generated in:

```text
dist/
```
