import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const AdminManageStudents = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    rollNo: '',
    className: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

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
    } catch (error) {
      console.error('Error fetching students:', error)
      setMessage({ type: 'danger', text: 'Failed to load students' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStudent) {
        await api.put(`/user/students/${editingStudent.studentId}`, formData)
        setMessage({ type: 'success', text: 'Student updated successfully!' })
      } else {
        await api.post('/user/students', formData)
        setMessage({ type: 'success', text: 'Student created successfully!' })
      }
      setShowModal(false)
      resetForm()
      fetchStudents()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Operation failed' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleEdit = async (studentId) => {
    try {
      const response = await api.get(`/user/students/${studentId}`)
      const student = response.data
      setFormData({
        username: student.username,
        password: '',
        email: student.email || '',
        phone: student.phone || '',
        rollNo: student.rollNo,
        className: student.className
      })
      setEditingStudent(student)
      setShowModal(true)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load student data' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    
    try {
      await api.delete(`/user/students/${studentId}`)
      setMessage({ type: 'success', text: 'Student deleted successfully!' })
      fetchStudents()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete student' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      phone: '',
      rollNo: '',
      className: ''
    })
    setEditingStudent(null)
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
      <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-people-fill text-primary me-2"></i>
          Manage Students
        </h1>
        <button className="btn btn-primary" onClick={openModal}>
          <i className="bi bi-person-plus-fill me-2"></i>Add New Student
        </button>
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
            <i className="bi bi-list-ul me-2"></i>Students List
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.rollNo}</td>
                      <td>{student.username}</td>
                      <td>{student.className}</td>
                      <td>{student.email || '-'}</td>
                      <td>{student.phone || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning me-2" 
                          onClick={() => handleEdit(student.studentId)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(student.studentId)}
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-person-fill me-2"></i>
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Password {editingStudent ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingStudent}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Roll Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Class *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingStudent ? 'Update' : 'Create'}
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

export default AdminManageStudents
