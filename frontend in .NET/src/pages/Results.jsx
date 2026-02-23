import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Results = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    marks: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [allResults, setAllResults] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingResult, setEditingResult] = useState(null)

  useEffect(() => {
    fetchStudents()
    fetchResults()
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
    }
  }

  const fetchResults = async () => {
    try {
      const response = await api.get('/result/all')
      setAllResults(response.data)
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await api.post('/result/upload', {
        studentId: parseInt(formData.studentId),
        subject: formData.subject,
        marks: parseFloat(formData.marks)
      })

      setMessage({
        type: 'success',
        text: 'Result uploaded successfully!'
      })

      setFormData({
        studentId: '',
        subject: '',
        marks: ''
      })

      fetchResults()
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to upload result'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (result) => {
    setFormData({
      studentId: result.studentId,
      subject: result.subject,
      marks: result.marks
    })
    setEditingResult(result)
    setShowEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await api.put(`/result/${editingResult.resultId}`, {
        studentId: parseInt(formData.studentId),
        subject: formData.subject,
        marks: parseFloat(formData.marks)
      })
      setMessage({ type: 'success', text: 'Result updated successfully!' })
      setShowEditModal(false)
      setFormData({ studentId: '', subject: '', marks: '' })
      setEditingResult(null)
      fetchResults()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to update result' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return
    
    try {
      await api.delete(`/result/${resultId}`)
      setMessage({ type: 'success', text: 'Result deleted successfully!' })
      fetchResults()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete result' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h1 className="mb-4">
        <i className="bi bi-graph-up text-success me-2"></i>
        Upload Results
      </h1>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-upload me-2"></i>Upload New Result
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="studentId" className="form-label">
                    <i className="bi bi-person me-2"></i>Student
                  </label>
                  <select
                    className="form-select"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
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
                  <label htmlFor="subject" className="form-label">
                    <i className="bi bi-book me-2"></i>Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Mathematics, Science, English"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="marks" className="form-label">
                    <i className="bi bi-star me-2"></i>Marks
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="marks"
                    name="marks"
                    value={formData.marks}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter marks (0-100)"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload me-2"></i>Upload Result
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>All Results
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-hover">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>Student</th>
                      <th>Roll No</th>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Date</th>
                      {user?.role === 'Admin' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {allResults.length > 0 ? (
                      allResults.map((result) => (
                        <tr key={result.resultId}>
                          <td>{result.studentName}</td>
                          <td>{result.rollNo}</td>
                          <td>{result.className}</td>
                          <td>{result.subject}</td>
                          <td>
                            <span className="badge bg-info">{result.marks}</span>
                          </td>
                          <td>{result.date}</td>
                          {user?.role === 'Admin' && (
                            <td>
                              <button 
                                className="btn btn-sm btn-warning me-2" 
                                onClick={() => handleEdit(result)}
                                title="Edit"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleDelete(result.resultId)}
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
                        <td colSpan={user?.role === 'Admin' ? 7 : 6} className="text-center text-muted">No results available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingResult && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-fill me-2"></i>Edit Result
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowEditModal(false)
                  setEditingResult(null)
                  setFormData({ studentId: '', subject: '', marks: '' })
                }}></button>
              </div>
              <form onSubmit={handleUpdate}>
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
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Marks *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowEditModal(false)
                    setEditingResult(null)
                    setFormData({ studentId: '', subject: '', marks: '' })
                  }}>Cancel</button>
                  <button type="submit" className="btn btn-warning" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
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

export default Results

