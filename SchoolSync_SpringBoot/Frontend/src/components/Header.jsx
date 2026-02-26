import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return null
    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard'
      case 'Teacher':
        return '/teacher/dashboard'
      case 'Student':
        return '/student/dashboard'
      default:
        return null
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-lg">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <i className="bi bi-mortarboard-fill me-2 text-warning"></i>
          <span className="brand-text">School Sync</span>
        </Link>
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link nav-link-modern" to="/">
                <i className="bi bi-house-fill me-2"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-modern" to="/about">
                <i className="bi bi-info-circle-fill me-2"></i>About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-modern" to="/contact">
                <i className="bi bi-envelope-fill me-2"></i>Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-modern" to="/admission">
                <i className="bi bi-file-earmark-person me-2"></i>Admission
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-modern" to="/admission/status">
                <i className="bi bi-search me-2"></i>Status
              </Link>
            </li>
            {user && getDashboardLink() && (
              <li className="nav-item">
                <Link className="nav-link nav-link-modern" to={getDashboardLink()}>
                  <i className="bi bi-speedometer2 me-2"></i>Dashboard
                </Link>
              </li>
            )}
            {user && user.role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/attendance">
                    <i className="bi bi-calendar-check me-2"></i>Attendance
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/results">
                    <i className="bi bi-graph-up me-2"></i>Results
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/enrollment">
                    <i className="bi bi-book me-2"></i>Enrollment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/fees">
                    <i className="bi bi-cash-coin me-2"></i>Fees
                  </Link>
                </li>
              </>
            )}
            {user && user.role === 'Teacher' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/attendance">
                    <i className="bi bi-calendar-check me-2"></i>Attendance
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/results">
                    <i className="bi bi-graph-up me-2"></i>Results
                  </Link>
                </li>
              </>
            )}
            {user && user.role === 'Student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to={`/student/profile/${user.studentId}`}>
                    <i className="bi bi-person-badge me-2"></i>Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/fees">
                    <i className="bi bi-cash-coin me-2"></i>Fees
                  </Link>
                </li>
              </>
            )}
            {/* {user && user.role === 'Admin' && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle nav-link-modern" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-gear-fill me-2"></i>Manage
                </a>
                <ul className="dropdown-menu dropdown-menu-modern">
                  <li><Link className="dropdown-item" to="/admin/students"><i className="bi bi-people-fill me-2"></i>Students</Link></li>
                  <li><Link className="dropdown-item" to="/admin/teachers"><i className="bi bi-person-badge-fill me-2"></i>Teachers</Link></li>
                  <li><Link className="dropdown-item" to="/admin/admissions"><i className="bi bi-file-earmark-person me-2"></i>Admissions</Link></li>
                  <li><Link className="dropdown-item" to="/admin/attendance"><i className="bi bi-calendar-check me-2"></i>Attendance</Link></li>
                  <li><Link className="dropdown-item" to="/admin/results"><i className="bi bi-graph-up me-2"></i>Results</Link></li>
                </ul>
              </li>
            )} */}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle user-dropdown" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <span className="user-info">
                      <span className="user-name">{user.username}</span>
                      <small className="user-role">{user.role}</small>
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-modern">
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link register-btn" to="/register">
                    <i className="bi bi-person-plus-fill me-2"></i>Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link login-btn" to="/login">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header

