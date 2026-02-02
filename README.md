# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking attendance.

## Tech Stack

**Frontend:**
- React 18
- Axios
- CSS3

**Backend:**
- Python 3.10+
- FastAPI
- Motor (async MongoDB driver)

**Database:**
- MongoDB

## Features

### Core Features
- Add new employees with unique ID, name, email, and department
- View all employees in a table
- Delete employees
- Mark daily attendance (Present/Absent)
- View attendance records

### Bonus Features
- Filter attendance by employee and date
- Dashboard with statistics (total employees, attendance counts)
- Real-time updates after each action
- Professional UI with loading and error states

## Local Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 16 or higher
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set MongoDB URL (optional):
```bash
export MONGODB_URL="mongodb://localhost:27017"  # Or your MongoDB Atlas URL
```

5. Run the server:
```bash
python main.py
```

Backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set API URL (optional):
```bash
export REACT_APP_API_URL="http://localhost:8000"
```

4. Start development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## API Endpoints

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `DELETE /api/employees/{employee_id}` - Delete employee
- `GET /api/attendance` - Get attendance records (with optional filters)
- `POST /api/attendance` - Mark attendance
- `GET /api/stats` - Get dashboard statistics

## Deployment

**Frontend:** Deployed on Vercel/Netlify
**Backend:** Deployed on Render/Railway
**Database:** MongoDB Atlas

## Assumptions

- Single admin user (no authentication implemented)
- Employee ID must be unique
- Email must be unique
- Attendance can only be marked once per employee per day
- Date format: YYYY-MM-DD

## Limitations

- No user authentication/authorization
- No edit functionality for employees
- No bulk operations
- Attendance cannot be updated once marked
