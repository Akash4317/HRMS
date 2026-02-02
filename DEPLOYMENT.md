# Deployment Guide

## Backend Deployment (Render/Railway)

### Using Render

1. Create account on Render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: hrms-lite-backend
   - Root Directory: backend
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - Key: `MONGODB_URL`
   - Value: Your MongoDB Atlas connection string
6. Click "Create Web Service"

### Using Railway

1. Create account on Railway.app
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: backend
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
6. Deploy

## Frontend Deployment (Vercel/Netlify)

### Using Vercel

1. Create account on Vercel.com
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: build
5. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL (e.g., https://hrms-lite-backend.onrender.com)
6. Click "Deploy"

### Using Netlify

1. Create account on Netlify.com
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select repository
4. Configure:
   - Base directory: frontend
   - Build command: `npm run build`
   - Publish directory: frontend/build
5. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL
6. Click "Deploy site"

## MongoDB Atlas Setup

1. Create account on MongoDB.com
2. Create a new cluster (free tier available)
3. Create database user with password
4. Add IP address 0.0.0.0/0 to whitelist (for development)
5. Get connection string from "Connect" > "Connect your application"
6. Replace `<password>` with your database user password
7. Use this connection string as `MONGODB_URL` in backend

## Important Notes

- Make sure CORS is properly configured in backend (already done in code)
- Backend URL in frontend should NOT have trailing slash
- Test all endpoints after deployment
- Check backend logs if frontend can't connect
