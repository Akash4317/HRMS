# HRMS Lite - Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py                 # FastAPI application with all endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── test_api.py            # API testing script
│
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Styling
│   │   └── index.js           # React entry point
│   ├── package.json           # Node dependencies
│   ├── .env.example          # Environment variables template
│   └── vercel.json           # Vercel deployment config
│
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Deployment instructions
└── .gitignore                # Git ignore rules
```

## Key Files

### Backend (main.py)
- FastAPI application with CORS enabled
- MongoDB async driver (Motor)
- RESTful API endpoints for employees and attendance
- Data validation using Pydantic models
- Error handling with proper HTTP status codes
- Bonus features: stats endpoint, filtering

### Frontend (App.js)
- Single-page React application
- Clean, professional UI with gradient header
- Responsive design
- Tab-based navigation (Employees/Attendance)
- Form validation and error handling
- Loading states and empty states
- Real-time statistics dashboard
- Filter functionality for attendance records

## Features Implemented

✅ **Core Requirements**
- Add/View/Delete employees
- Mark and view attendance
- Input validation
- Error handling
- Professional UI

✅ **Bonus Features**
- Filter attendance by employee and date
- Statistics dashboard
- Total present days tracking
- Clean, production-ready design

## Quick Start Commands

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Environment Variables

**Backend (.env):**
```
MONGODB_URL=mongodb://localhost:27017
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:8000
```
