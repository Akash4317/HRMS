# HRMS Lite - Quick Start Guide

## What You Have

A complete full-stack HRMS application with:
- ✅ React frontend with professional UI
- ✅ FastAPI backend with MongoDB
- ✅ All core features implemented
- ✅ Bonus features included
- ✅ Ready for deployment

## Immediate Next Steps

### 1. Set Up MongoDB (5 minutes)

**Option A: MongoDB Atlas (Recommended for deployment)**
1. Go to mongodb.com and create free account
2. Create a new cluster (free tier)
3. Create database user with password
4. Whitelist IP: 0.0.0.0/0
5. Get connection string (looks like: mongodb+srv://username:password@cluster.mongodb.net/)

**Option B: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 mongo:latest
```

### 2. Test Locally (10 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
export MONGODB_URL="your-mongodb-connection-string"  # or use local
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

Visit: http://localhost:3000

### 3. Deploy (20 minutes)

**Backend to Render:**
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect repo, set root directory: `backend`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env var: `MONGODB_URL` = your MongoDB Atlas string
7. Deploy and copy URL

**Frontend to Vercel:**
1. Go to vercel.com → New Project
2. Import from GitHub
3. Root directory: `frontend`
4. Add env var: `REACT_APP_API_URL` = your backend URL
5. Deploy and copy URL

### 4. Submit

Share these URLs:
- Live Frontend: (Your Vercel URL)
- Backend API: (Your Render URL)
- GitHub Repo: (Your repository link)

## Test Your Deployment

1. Open your frontend URL
2. Add an employee
3. Mark attendance
4. Check that data persists
5. Try filtering attendance

## Troubleshooting

**Frontend can't connect to backend:**
- Check REACT_APP_API_URL is correct (no trailing slash)
- Verify backend is running
- Check browser console for errors

**Backend errors:**
- Verify MONGODB_URL is correct
- Check MongoDB Atlas whitelist includes 0.0.0.0/0
- View backend logs on Render

**Build failures:**
- Ensure all files are committed to GitHub
- Check requirements.txt and package.json are present
- Verify root directories are set correctly

## Time Breakdown

- Local setup: 15 minutes
- Testing: 15 minutes  
- Deployment: 30 minutes
- Total: ~1 hour (well under 6-8 hour limit)

## What's Included

**Core Features:**
- ✅ Employee management (add, view, delete)
- ✅ Attendance tracking
- ✅ Data validation
- ✅ Error handling
- ✅ Professional UI

**Bonus Features:**
- ✅ Attendance filtering by employee and date
- ✅ Dashboard with statistics
- ✅ Present days counter
- ✅ Loading and empty states
- ✅ Responsive design

Good luck! 🚀
