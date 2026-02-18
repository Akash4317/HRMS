import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todayStats, setTodayStats] = useState(null);

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  // Filter state
  const [filters, setFilters] = useState({
    employee_id: '',
    date: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    fetchStats();
    fetchTodayStats();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/employees`);
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.employee_id) params.employee_id = filters.employee_id;
      if (filters.date) params.date_filter = filters.date;

      const response = await axios.get(`${API_URL}/api/attendance`, { params });
      setAttendance(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats/today`);
      setTodayStats(response.data);
    } catch (err) {
      console.error("Failed to fetch today's stats");
    }
  };


  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/employees`, employeeForm);
      setSuccess('Employee added successfully!');
      setEmployeeForm({ employee_id: '', full_name: '', email: '', department: '' });
      fetchEmployees();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add employee');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/employees/${employeeId}`);
      setSuccess('Employee deleted successfully!');
      fetchEmployees();
      fetchAttendance();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete employee');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/attendance`, attendanceForm);
      setSuccess('Attendance marked successfully!');
      setAttendanceForm({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
      fetchAttendance();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchAttendance();
  };

  const clearFilters = () => {
    setFilters({ employee_id: '', date: '' });
    setTimeout(() => fetchAttendance(), 100);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>HRMS Lite</h1>
        <p>Employee & Attendance Management System</p>
      </header>

      <div className="container">
        {/* Stats Dashboard */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Employees</h3>
              <p>{stats.total_employees}</p>
            </div>
            <div className="stat-card">
              <h3>Total Records</h3>
              <p>{stats.total_attendance_records}</p>
            </div>
            <div className="stat-card">
              <h3>Total Present</h3>
              <p>{stats.total_present}</p>
            </div>
            <div className="stat-card">
              <h3>Total Absent</h3>
              <p>{stats.total_absent}</p>
            </div>
          </div>
        )}

        {todayStats && (
          <div className="stat-card" style={{ marginTop: "1rem" }}>
            <h3>Today's Attendance</h3>
            <p>Present: {todayStats.present_today}</p>
            <p>Absent: {todayStats.absent_today}</p>
            <p>Attendance %: {todayStats.attendance_percentage}%</p>
          </div>
        )}


        {/* Navigation */}
        <nav className="nav">
          <button
            className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button
            className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </nav>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <>
            <div className="card">
              <h2>Add New Employee</h2>
              <form onSubmit={handleEmployeeSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input
                      type="text"
                      value={employeeForm.employee_id}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, employee_id: e.target.value })}
                      required
                      placeholder="e.g., EMP001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={employeeForm.full_name}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, full_name: e.target.value })}
                      required
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                      placeholder="e.g., john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      value={employeeForm.department}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                      required
                      placeholder="e.g., Engineering"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Employee'}
                </button>
              </form>
            </div>

            <div className="card">
              <h2>Employee List</h2>
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading employees...</p>
                </div>
              ) : employees.length === 0 ? (
                <div className="empty-state">
                  <h3>No employees found</h3>
                  <p>Add your first employee to get started</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id}>
                          <td>{emp.employee_id}</td>
                          <td>{emp.full_name}</td>
                          <td>{emp.email}</td>
                          <td>{emp.department}</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteEmployee(emp.employee_id)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <>
            <div className="card">
              <h2>Mark Attendance</h2>
              <form onSubmit={handleAttendanceSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee *</label>
                    <select
                      value={attendanceForm.employee_id}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, employee_id: e.target.value })}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.employee_id}>
                          {emp.employee_id} - {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={attendanceForm.date}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={attendanceForm.status}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                      required
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Marking...' : 'Mark Attendance'}
                </button>
              </form>
            </div>

            <div className="card">
              <h2>Attendance Records</h2>

              <div className="filter-section">
                <h3>Filters</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee</label>
                    <select
                      name="employee_id"
                      value={filters.employee_id}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Employees</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.employee_id}>
                          {emp.employee_id} - {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={applyFilters} className="btn btn-primary">
                    Apply Filters
                  </button>
                  <button onClick={clearFilters} className="btn" style={{ background: '#e2e8f0' }}>
                    Clear Filters
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading attendance records...</p>
                </div>
              ) : attendance.length === 0 ? (
                <div className="empty-state">
                  <h3>No attendance records found</h3>
                  <p>Start marking attendance to see records here</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record) => (
                        <tr key={record.id}>
                          <td>{record.employee_id}</td>
                          <td>{record.full_name}</td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
