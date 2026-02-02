#!/usr/bin/env python3
"""
Simple test script to verify HRMS Lite API functionality
"""
import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing HRMS Lite API...")
    print("=" * 50)
    
    # Test 1: Root endpoint
    print("\n1. Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test 2: Add employee
    print("\n2. Adding test employee...")
    employee_data = {
        "employee_id": "TEST001",
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "department": "Engineering"
    }
    response = requests.post(f"{BASE_URL}/api/employees", json=employee_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        print(f"Employee created: {response.json()}")
    else:
        print(f"Error: {response.json()}")
    
    # Test 3: Get all employees
    print("\n3. Getting all employees...")
    response = requests.get(f"{BASE_URL}/api/employees")
    print(f"Status: {response.status_code}")
    print(f"Employees: {json.dumps(response.json(), indent=2)}")
    
    # Test 4: Mark attendance
    print("\n4. Marking attendance...")
    attendance_data = {
        "employee_id": "TEST001",
        "date": str(date.today()),
        "status": "Present"
    }
    response = requests.post(f"{BASE_URL}/api/attendance", json=attendance_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        print(f"Attendance marked: {response.json()}")
    else:
        print(f"Error: {response.json()}")
    
    # Test 5: Get attendance records
    print("\n5. Getting attendance records...")
    response = requests.get(f"{BASE_URL}/api/attendance")
    print(f"Status: {response.status_code}")
    print(f"Attendance: {json.dumps(response.json(), indent=2)}")
    
    # Test 6: Get stats
    print("\n6. Getting statistics...")
    response = requests.get(f"{BASE_URL}/api/stats")
    print(f"Status: {response.status_code}")
    print(f"Stats: {json.dumps(response.json(), indent=2)}")
    
    print("\n" + "=" * 50)
    print("All tests completed!")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to API. Make sure the backend is running on localhost:8000")
    except Exception as e:
        print(f"Error: {e}")
