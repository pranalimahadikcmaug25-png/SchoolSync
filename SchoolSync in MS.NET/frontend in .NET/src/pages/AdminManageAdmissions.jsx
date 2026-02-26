import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const AdminManageAdmissions = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [admissions, setAdmissions] = useState([])
  const [selectedAdmission, setSelectedAdmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [statusForm, setStatusForm] = useState({
    status: 'Pending',
    remarks: '',
    createStudentAccount: false
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const fetchAdmissions = async () => {
    try {
      const response = await api.get('/admission/all')
      setAdmissions(response.data)
    } catch (error) {
      console.error('Error fetching admissions:', error)
      setMessage({ type: 'danger', text: 'Failed to load admissions' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (admissionId) => {
    try {
      const response = await api.get(`/admission/${admissionId}`)
      setSelectedAdmission(response.data)
      setShowModal(true)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load admission details' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/admission/${selectedAdmission.admissionId}/status`, statusForm)
      setMessage({ type: 'success', text: 'Admission status updated successfully!' })
      setShowModal(false)
      setSelectedAdmission(null)
      fetchAdmissions()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to update status' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handleDelete = async (admissionId) => {
    if (!window.confirm('Are you sure you want to delete this admission application?')) return
    
    try {
      await api.delete(`/admission/${admissionId}`)
      setMessage({ type: 'success', text: 'Admission deleted successfully!' })
      fetchAdmissions()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete admission' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-warning',
      'Approved': 'bg-success',
      'Rejected': 'bg-danger',
      'Under Review': 'bg-info'
    }
    return badges[status] || 'bg-secondary'
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
          <i className="bi bi-file-earmark-person text-primary me-2"></i>
          Admission Applications
        </h1>
        <span className="badge bg-primary">Total: {admissions.length}</span>
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
            <i className="bi bi-list-ul me-2"></i>All Applications
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>App. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.length > 0 ? (
                  admissions.map((admission) => (
                    <tr key={admission.admissionId}>
                      <td>{admission.applicationNumber}</td>
                      <td>{admission.fullName}</td>
                      <td>{admission.email}</td>
                      <td>{admission.phone}</td>
                      <td>{admission.appliedClass}</td>
                      <td>{admission.applicationDate}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(admission.status)}`}>
                          {admission.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2" 
                          onClick={() => handleViewDetails(admission.admissionId)}
                          title="View Details"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(admission.admissionId)}
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">No admission applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedAdmission && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-person me-2"></i>
                  Application Details - {selectedAdmission.applicationNumber}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowModal(false)
                  setSelectedAdmission(null)
                }}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Personal Information</strong>
                    <hr />
                    <p><strong>Name:</strong> {selectedAdmission.firstName} {selectedAdmission.lastName}</p>
                    <p><strong>DOB:</strong> {selectedAdmission.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {selectedAdmission.gender}</p>
                    <p><strong>Email:</strong> {selectedAdmission.email}</p>
                    <p><strong>Phone:</strong> {selectedAdmission.phone}</p>
                    <p><strong>Address:</strong> {selectedAdmission.address}, {selectedAdmission.city}, {selectedAdmission.state} - {selectedAdmission.pincode}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Academic Information</strong>
                    <hr />
                    <p><strong>Applied Class:</strong> {selectedAdmission.appliedClass}</p>
                    <p><strong>Academic Year:</strong> {selectedAdmission.academicYear}</p>
                    <p><strong>Application Date:</strong> {selectedAdmission.applicationDate}</p>
                    <p><strong>Status:</strong> <span className={`badge ${getStatusBadge(selectedAdmission.status)}`}>{selectedAdmission.status}</span></p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Father's Information</strong>
                    <hr />
                    <p><strong>Name:</strong> {selectedAdmission.fatherName}</p>
                    <p><strong>Occupation:</strong> {selectedAdmission.fatherOccupation}</p>
                    <p><strong>Phone:</strong> {selectedAdmission.fatherPhone}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Mother's Information</strong>
                    <hr />
                    <p><strong>Name:</strong> {selectedAdmission.motherName}</p>
                    <p><strong>Occupation:</strong> {selectedAdmission.motherOccupation}</p>
                    <p><strong>Phone:</strong> {selectedAdmission.motherPhone}</p>
                  </div>
                </div>
                {selectedAdmission.guardianName && (
                  <div className="mb-3">
                    <strong>Guardian Information</strong>
                    <hr />
                    <p><strong>Name:</strong> {selectedAdmission.guardianName}</p>
                    <p><strong>Relation:</strong> {selectedAdmission.guardianRelation}</p>
                    <p><strong>Phone:</strong> {selectedAdmission.guardianPhone}</p>
                  </div>
                )}
                {selectedAdmission.previousSchool && (
                  <div className="mb-3">
                    <strong>Previous School</strong>
                    <hr />
                    <p><strong>School:</strong> {selectedAdmission.previousSchool}</p>
                    <p><strong>Class:</strong> {selectedAdmission.previousClass}</p>
                    <p><strong>Marks:</strong> {selectedAdmission.previousMarks}%</p>
                  </div>
                )}

                <hr />
                <form onSubmit={handleUpdateStatus}>
                  <h6>Update Status</h6>
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={statusForm.status}
                      onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      value={statusForm.remarks}
                      onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="createAccount"
                      checked={statusForm.createStudentAccount}
                      onChange={(e) => setStatusForm({ ...statusForm, createStudentAccount: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="createAccount">
                      Create Student Account (if approved)
                    </label>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => {
                      setShowModal(false)
                      setSelectedAdmission(null)
                    }}>Close</button>
                    <button type="submit" className="btn btn-primary">Update Status</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManageAdmissions

