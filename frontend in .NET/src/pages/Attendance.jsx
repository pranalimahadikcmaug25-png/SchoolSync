import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Attendance = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showSmsAlert, setShowSmsAlert] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/user/students')
      setStudents(response.data)
      
      // Load today's attendance if exists
      const today = new Date().toISOString().split('T')[0]
      const attendanceRes = await api.get('/attendance/all')
      const todayAttendance = attendanceRes.data.filter(a => a.date === today)
      
      const attendanceMap = {}
      todayAttendance.forEach(a => {
        attendanceMap[a.studentId] = a.status
      })
      setAttendance(attendanceMap)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    setShowSmsAlert(false)

    try {
      const absentStudents = []
      
      for (const student of students) {
        const status = attendance[student.studentId] || 'Present'
        
        await api.post('/attendance/mark', {
          studentId: student.studentId,
          date: selectedDate,
          status: status
        })

        if (status === 'Absent') {
          absentStudents.push(student.username)
        }
      }

      setMessage({
        type: 'success',
        text: 'Attendance marked successfully!'
      })

      // Show SMS alert for absent students (UI only)
      if (absentStudents.length > 0) {
        setShowSmsAlert(true)
        setTimeout(() => setShowSmsAlert(false), 10000)
      }
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to mark attendance'
      })
    } finally {
      setLoading(false)
    }
  }

  const markAllPresent = () => {
    const allPresent = {}
    students.forEach(student => {
      allPresent[student.studentId] = 'Present'
    })
    setAttendance(allPresent)
  }

  const markAllAbsent = () => {
    const allAbsent = {}
    students.forEach(student => {
      allAbsent[student.studentId] = 'Absent'
    })
    setAttendance(allAbsent)
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h1 className="mb-4">
        <i className="bi bi-calendar-check text-primary me-2"></i>
        Mark Attendance
      </h1>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* SMS Alert (UI Only) */}
      {showSmsAlert && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <i className="bi bi-chat-dots-fill me-2"></i>
          <strong>SMS Notification:</strong> Absence notifications have been sent to parents via SMS.
          <button type="button" className="btn-close" onClick={() => setShowSmsAlert(false)}></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0">
                <i className="bi bi-calendar3 me-2"></i>
                Select Date
              </h5>
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-light btn-sm me-2" onClick={markAllPresent}>
                <i className="bi bi-check-all me-1"></i>Mark All Present
              </button>
              <button className="btn btn-light btn-sm" onClick={markAllAbsent}>
                <i className="bi bi-x-lg me-1"></i>Mark All Absent
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="date" className="form-label">
                <i className="bi bi-calendar-date me-2"></i>Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.rollNo}</td>
                      <td>{student.username}</td>
                      <td>{student.className}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <input
                            type="radio"
                            className="btn-check"
                            name={`status_${student.studentId}`}
                            id={`present_${student.studentId}`}
                            checked={attendance[student.studentId] === 'Present' || !attendance[student.studentId]}
                            onChange={() => handleStatusChange(student.studentId, 'Present')}
                          />
                          <label
                            className="btn btn-outline-success"
                            htmlFor={`present_${student.studentId}`}
                          >
                            <i className="bi bi-check-circle me-1"></i>Present
                          </label>

                          <input
                            type="radio"
                            className="btn-check"
                            name={`status_${student.studentId}`}
                            id={`absent_${student.studentId}`}
                            checked={attendance[student.studentId] === 'Absent'}
                            onChange={() => handleStatusChange(student.studentId, 'Absent')}
                          />
                          <label
                            className="btn btn-outline-danger"
                            htmlFor={`absent_${student.studentId}`}
                          >
                            <i className="bi bi-x-circle me-1"></i>Absent
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading || students.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>Save Attendance
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>Note:</strong> When a student is marked as absent, an email notification will be 
          automatically sent to the registered email address. SMS notifications are shown as UI alerts only.
        </div>
      </div>
    </div>
  )
}

export default Attendance

