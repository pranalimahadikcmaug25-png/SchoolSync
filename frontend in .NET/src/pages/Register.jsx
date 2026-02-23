import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: '', // Changed to empty - user must select
    email: '',
    phone: '',
    rollNo: '',
    className: '',
    subject: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!formData.role) {
      setError('Please select your role')
      setLoading(false)
      return
    }

    if (!formData.username.trim()) {
      setError('Username is required')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const registerData = {
      Username: formData.username.trim(),
      Password: formData.password,
      Role: formData.role,
      Email: formData.email.trim() || null,
      Phone: formData.phone.trim() || null
    }

    if (formData.role === 'Student') {
      registerData.RollNo = formData.rollNo.trim() || null
      registerData.Class = formData.className.trim() || null
    } else if (formData.role === 'Teacher') {
      registerData.Subject = formData.subject.trim() || null
    }

    try {
      const result = await register(registerData)
      
      if (result.success && result.user) {
        // Registration successful - redirect to login
        setSuccess('Registration successful! Redirecting to login page...')
        setError('')
        
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      } else if (result.success) {
        // Registration successful but user data not returned
        setSuccess('Registration successful! Please login with your credentials.')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      } else {
        setError(result.message || 'Registration failed. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-bg">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="card shadow-lg auth-card">
              <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="register-icon-wrapper mb-3">
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="register-title">Create Your Account</h2>
                <p className="register-subtitle">Join Smart School System and unlock your potential!</p>
              </div>

              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Role Selection - Prominent */}
                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-bold">
                    <i className="bi bi-person-badge-fill me-2 text-primary"></i>Select Your Role *
                  </label>
                    <select
                      className="form-select form-select-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      style={{ 
                        fontSize: '1.1rem', 
                        border: formData.role ? '2px solid #198754' : '2px solid #0d6efd',
                        backgroundColor: formData.role ? '#f0f9ff' : '#fff'
                      }}
                    >
                      <option value="">-- Please Select Your Role --</option>
                      <option value="Student">👨‍🎓 Student</option>
                      <option value="Teacher">👩‍🏫 Teacher</option>
                    {/*  <option value="Admin">👨‍💼 Admin - For administrators to manage the entire system</option> */}
                    </select>
                  {formData.role && (
                    <div className="alert alert-success mt-2 mb-0">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <strong>Selected:</strong> {formData.role} - {
                        formData.role === 'Student' ? 'You will be able to view your attendance, results, and fees' :
                        formData.role === 'Teacher' ? 'You will be able to mark attendance and upload results' :
                        'You will have full system access'
                      }
                    </div>
                  )}
                  {!formData.role && (
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Select your role to continue with registration
                    </small>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-2"></i>Username *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-2"></i>Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>Password *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>Confirm Password *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      <i className="bi bi-telephone me-2"></i>Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.role === 'Student' && (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="rollNo" className="form-label">
                        <i className="bi bi-123 me-2"></i>Roll Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rollNo"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="className" className="form-label">
                        <i className="bi bi-book me-2"></i>Class
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="className"
                        name="className"
                        value={formData.className}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {formData.role === 'Teacher' && (
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                      <i className="bi bi-book-half me-2"></i>Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g., Mathematics, Science, English"
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3 btn-lg register-submit-btn"
                  disabled={loading || !formData.role}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating your account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill me-2"></i>Create My Account
                    </>
                  )}
                </button>

                {!formData.role && (
                  <div className="alert alert-warning mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Please select your role above to continue
                  </div>
                )}
              </form>

              <hr />
              <div className="text-center">
                <p className="mb-2">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login Here
                  </Link>
                </p>
                <Link to="/login" className="btn btn-outline-secondary w-100">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Go to Login Page
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

