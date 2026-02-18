from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from enum import Enum

app = FastAPI(title="HRMS Lite API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.hrms_lite

# Collections
employees_collection = db.employees
attendance_collection = db.attendance


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)

    @validator('employee_id', 'full_name', 'department')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty')
        return v.strip()


class EmployeeResponse(BaseModel):
    id: str
    employee_id: str
    full_name: str
    email: str
    department: str


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    full_name: str
    date: str
    status: str


@app.get("/")
async def root():
    return {"message": "HRMS Lite API", "status": "running"}


@app.post("/api/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    # Check if employee_id already exists
    existing = await employees_collection.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee ID '{employee.employee_id}' already exists"
        )
    
    # Check if email already exists
    existing_email = await employees_collection.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{employee.email}' already exists"
        )
    
    employee_dict = employee.dict()
    result = await employees_collection.insert_one(employee_dict)
    
    created_employee = await employees_collection.find_one({"_id": result.inserted_id})
    return EmployeeResponse(
        id=str(created_employee["_id"]),
        employee_id=created_employee["employee_id"],
        full_name=created_employee["full_name"],
        email=created_employee["email"],
        department=created_employee["department"]
    )


@app.get("/api/employees", response_model=List[EmployeeResponse])
async def get_employees():
    employees = []
    cursor = employees_collection.find({})
    async for employee in cursor:
        employees.append(EmployeeResponse(
            id=str(employee["_id"]),
            employee_id=employee["employee_id"],
            full_name=employee["full_name"],
            email=employee["email"],
            department=employee["department"]
        ))
    return employees


@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    result = await employees_collection.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    # Also delete attendance records
    await attendance_collection.delete_many({"employee_id": employee_id})
    return None


@app.post("/api/attendance", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    # Check if employee exists
    employee = await employees_collection.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    # Check if attendance already marked for this date
    existing = await attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat()
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance already marked for {attendance.date.isoformat()}"
        )
    
    attendance_dict = {
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat(),
        "status": attendance.status.value
    }
    
    result = await attendance_collection.insert_one(attendance_dict)
    
    return AttendanceResponse(
        id=str(result.inserted_id),
        employee_id=attendance.employee_id,
        full_name=employee["full_name"],
        date=attendance.date.isoformat(),
        status=attendance.status.value
    )


@app.get("/api/attendance", response_model=List[AttendanceResponse])
async def get_attendance(employee_id: Optional[str] = None, date_filter: Optional[str] = None):
    query = {}
    
    if employee_id:
        query["employee_id"] = employee_id
    
    if date_filter:
        query["date"] = date_filter
    
    attendance_records = []
    cursor = attendance_collection.find(query).sort("date", -1)
    
    async for record in cursor:
        employee = await employees_collection.find_one({"employee_id": record["employee_id"]})
        attendance_records.append(AttendanceResponse(
            id=str(record["_id"]),
            employee_id=record["employee_id"],
            full_name=employee["full_name"] if employee else "Unknown",
            date=record["date"],
            status=record["status"]
        ))
    
    return attendance_records


@app.get("/api/stats")
async def get_stats():
    total_employees = await employees_collection.count_documents({})
    
    # Get unique employees with attendance
    pipeline = [
        {"$group": {"_id": "$employee_id"}}
    ]
    unique_employees = await attendance_collection.aggregate(pipeline).to_list(None)
    employees_with_attendance = len(unique_employees)
    
    # Total attendance records
    total_records = await attendance_collection.count_documents({})
    
    # Present count
    present_count = await attendance_collection.count_documents({"status": "Present"})
    
    return {
        "total_employees": total_employees,
        "employees_with_attendance": employees_with_attendance,
        "total_attendance_records": total_records,
        "total_present": present_count,
        "total_absent": total_records - present_count
    }

@app.get("/api/stats/today")
async def get_today_stats():
    today = date.today().isoformat()

    total_employees = await employees_collection.count_documents({})
    
    today_records = await attendance_collection.count_documents({"date": today})
    
    present_today = await attendance_collection.count_documents({
        "date": today,
        "status": "Present"
    })

    absent_today = today_records - present_today

    attendance_percentage = (
        round((today_records / total_employees) * 100, 2)
        if total_employees > 0 else 0
    )

    return {
        "date": today,
        "present_today": present_today,
        "absent_today": absent_today,
        "attendance_marked": today_records,
        "attendance_percentage": attendance_percentage
    }

@app.get("/api/attendance/summary/{employee_id}")
async def get_employee_attendance_summary(employee_id: str):
    # Check if employee exists
    employee = await employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    total_records = await attendance_collection.count_documents({"employee_id": employee_id})
    present_days = await attendance_collection.count_documents({
        "employee_id": employee_id,
        "status": "Present"
    })
    absent_days = total_records - present_days
    
    return {
        "employee_id": employee_id,
        "full_name": employee["full_name"],
        "total_days": total_records,
        "present_days": present_days,
        "absent_days": absent_days
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
