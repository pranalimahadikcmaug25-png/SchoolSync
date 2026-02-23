import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const AdminManageTeachers = () => {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    subject: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/user/teachers')
      setTeachers(response.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
      setMessage({ type: 'danger', text: 'Failed to load teachers' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTeacher) {
        await api.put(`/user/teachers/${editingTeacher.teacherId}`, formData)
        setMessage({ type: 'success', text: 'Teacher updated successfully!' })
      } else {
        await api.post('/user/teachers', formData)
        setMessage({ type: 'success', text: 'Teacher created successfully!' })
      }
      setShowModal(false)
      resetForm()
      fetchTeachers()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Operation failed' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleEdit = async (teacherId) => {
    try {
      const response = await api.get(`/user/teachers/${teacherId}`)
      const teacher = response.data
      setFormData({
        username: teacher.username,
        password: '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        subject: teacher.subject
      })
      setEditingTeacher(teacher)
      setShowModal(true)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load teacher data' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleDelete = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return
    
    try {
      await api.delete(`/user/teachers/${teacherId}`)
      setMessage({ type: 'success', text: 'Teacher deleted successfully!' })
      fetchTeachers()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete teacher' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      phone: '',
      subject: ''
    })
    setEditingTeacher(null)
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
          <i className="bi bi-person-badge-fill text-success me-2"></i>
          Manage Teachers
        </h1>
        <button className="btn btn-success" onClick={openModal}>
          <i className="bi bi-person-plus-fill me-2"></i>Add New Teacher
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
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>Teachers List
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr key={teacher.teacherId}>
                      <td>{teacher.username}</td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.email || '-'}</td>
                      <td>{teacher.phone || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning me-2" 
                          onClick={() => handleEdit(teacher.teacherId)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(teacher.teacherId)}
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No teachers found</td>
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
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="bi bi-person-badge-fill me-2"></i>
                  {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
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
                      Password {editingTeacher ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingTeacher}
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
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g., Mathematics, Science, English"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-success">
                    {editingTeacher ? 'Update' : 'Create'}
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

export default AdminManageTeachers

