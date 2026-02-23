import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const EnrollmentManagement = () => {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState(null)
  const [formData, setFormData] = useState({
    studentId: '',
    academicYear: new Date().getFullYear().toString(),
    className: '',
    section: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    remarks: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [enrollmentsRes, studentsRes] = await Promise.all([
        api.get('/studentmanagement/enrollment/all'),
        api.get('/user/students')
      ])
      setEnrollments(enrollmentsRes.data)
      setStudents(studentsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage({ type: 'danger', text: 'Failed to load data' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingEnrollment) {
        await api.put(`/studentmanagement/enrollment/${editingEnrollment.enrollmentId}`, formData)
        setMessage({ type: 'success', text: 'Enrollment updated successfully!' })
      } else {
        await api.post('/studentmanagement/enrollment', formData)
        setMessage({ type: 'success', text: 'Enrollment created successfully!' })
      }
      setShowModal(false)
      resetForm()
      fetchData()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Operation failed' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleEdit = (enrollment) => {
    setFormData({
      studentId: enrollment.studentId,
      academicYear: enrollment.academicYear,
      className: enrollment.className,
      section: enrollment.section,
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status,
      remarks: enrollment.remarks || ''
    })
    setEditingEnrollment(enrollment)
    setShowModal(true)
  }

  const handleDelete = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return
    
    try {
      await api.delete(`/studentmanagement/enrollment/${enrollmentId}`)
      setMessage({ type: 'success', text: 'Enrollment deleted successfully!' })
      fetchData()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete enrollment' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      academicYear: new Date().getFullYear().toString(),
      className: '',
      section: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      remarks: ''
    })
    setEditingEnrollment(null)
  }

  const openModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
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
          <i className="bi bi-book-fill text-primary me-2"></i>
          Enrollment Management
        </h1>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={openModal}>
            <i className="bi bi-plus-circle-fill me-2"></i>New Enrollment
          </button>
        )}
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>Enrollment Records
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Academic Year</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  {user?.role === 'Admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment.enrollmentId}>
                      <td>{enrollment.studentName}</td>
                      <td>{enrollment.rollNo}</td>
                      <td>{enrollment.academicYear}</td>
                      <td>{enrollment.className}</td>
                      <td>{enrollment.section}</td>
                      <td>{enrollment.enrollmentDate}</td>
                      <td>
                        <span className={`badge ${enrollment.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      {user?.role === 'Admin' && (
                        <td>
                          <button 
                            className="btn btn-sm btn-warning me-2" 
                            onClick={() => handleEdit(enrollment)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(enrollment.enrollmentId)}
                            title="Delete"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={user?.role === 'Admin' ? 8 : 7} className="text-center text-muted">No enrollment records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && user?.role === 'Admin' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-book-fill me-2"></i>
                  {editingEnrollment ? 'Edit Enrollment' : 'New Enrollment'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Student *</label>
                    <select
                      className="form-select"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.studentId} value={student.studentId}>
                          {student.username} - {student.rollNo} ({student.className})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Academic Year *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Class *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Section *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enrollment Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.enrollmentDate}
                      onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Transferred">Transferred</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingEnrollment ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrollmentManagement

