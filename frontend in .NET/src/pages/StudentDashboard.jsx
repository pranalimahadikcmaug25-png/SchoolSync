import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.studentId) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [attendanceRes, resultsRes] = await Promise.all([
        api.get(`/attendance/student/${user.studentId}`),
        api.get(`/result/student/${user.studentId}`)
      ])

      setAttendance(attendanceRes.data)
      setResults(resultsRes.data)

      const presentDays = attendanceRes.data.filter(a => a.status === 'Present').length
      const absentDays = attendanceRes.data.filter(a => a.status === 'Absent').length
      const totalDays = attendanceRes.data.length
      const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0

      setStats({
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage: percentage
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-speedometer2 text-info me-2"></i>
          Student Dashboard
        </h1>
        <div>
          <Link to={`/student/profile/${user?.studentId}`} className="btn btn-primary me-2">
            <i className="bi bi-person-badge me-2"></i>View Profile
          </Link>
          <span className="badge bg-info">Welcome, {user?.username}!</span>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <Link to={`/student/profile/${user?.studentId}`} className="text-decoration-none">
            <div className="card bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-person-badge" style={{ fontSize: '48px' }}></i>
                <h6 className="mt-3">My Profile</h6>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/fees" className="text-decoration-none">
            <div className="card bg-warning text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-cash-coin" style={{ fontSize: '48px' }}></i>
                <h6 className="mt-3">Fee Status</h6>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check" style={{ fontSize: '48px' }}></i>
              <h6 className="mt-3">Attendance</h6>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body text-center">
              <i className="bi bi-graph-up" style={{ fontSize: '48px' }}></i>
              <h6 className="mt-3">Results</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check" style={{ fontSize: '48px', opacity: 0.5 }}></i>
              <h5 className="mt-3">Total Days</h5>
              <h2 className="mb-0">{stats.totalDays}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="bi bi-check-circle" style={{ fontSize: '48px', opacity: 0.5 }}></i>
              <h5 className="mt-3">Present Days</h5>
              <h2 className="mb-0">{stats.presentDays}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <i className="bi bi-x-circle" style={{ fontSize: '48px', opacity: 0.5 }}></i>
              <h5 className="mt-3">Absent Days</h5>
              <h2 className="mb-0">{stats.absentDays}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="bi bi-percent" style={{ fontSize: '48px', opacity: 0.5 }}></i>
              <h5 className="mt-3">Attendance %</h5>
              <h2 className="mb-0">{stats.attendancePercentage}%</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Attendance Table */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>Attendance History
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length > 0 ? (
                      attendance.map((record) => (
                        <tr key={record.attendanceId}>
                          <td>{record.date}</td>
                          <td>
                            <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-muted">No attendance records</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>Academic Results
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length > 0 ? (
                      results.map((result) => (
                        <tr key={result.resultId}>
                          <td>{result.subject}</td>
                          <td>
                            <span className="badge bg-info">{result.marks}</span>
                          </td>
                          <td>{result.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">No results available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard

