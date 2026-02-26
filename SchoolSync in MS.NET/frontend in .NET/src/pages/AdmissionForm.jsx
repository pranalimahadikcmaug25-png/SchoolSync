import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Base64 image for the side card
const admissionDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANUAAADt...'; // truncated for brevity

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [applicationNumber, setApplicationNumber] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    appliedClass: '',
    academicYear: new Date().getFullYear().toString(),
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    previousSchool: '',
    previousClass: '',
    previousMarks: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/admission/apply', {
        ...formData,
        previousMarks: formData.previousMarks ? parseFloat(formData.previousMarks) : null
      });

      setApplicationNumber(response.data.applicationNumber);
      setMessage({ type: 'success', text: response.data.message });

      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          appliedClass: '',
          academicYear: new Date().getFullYear().toString(),
          fatherName: '',
          fatherOccupation: '',
          fatherPhone: '',
          motherName: '',
          motherOccupation: '',
          motherPhone: '',
          guardianName: '',
          guardianRelation: '',
          guardianPhone: '',
          previousSchool: '',
          previousClass: '',
          previousMarks: ''
        });
        setApplicationNumber('');
      }, 10000);
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to submit application. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0">Online Admission Form</h2>
              <p className="mb-0 mt-2">Fill in all the details to apply for admission</p>
            </div>

            <div className="card-body p-4">
              <div className="row">
                {/* Form Section */}
                <div className="col-lg-8">
                  {message.text && (
                    <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                      {message.text}
                      {applicationNumber && (
                        <div className="mt-2">
                          <strong>Application Number: {applicationNumber}</strong>
                        </div>
                      )}
                      <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Personal Details */}
                    <h5 className="mb-3">Personal Details</h5>
                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          className="form-control"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          className="form-control"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <select
                          name="gender"
                          className="form-select"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <textarea
                        name="address"
                        placeholder="Address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          className="form-control"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          className="form-control"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="pincode"
                          placeholder="Pincode"
                          className="form-control"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Academic Information */}
                    <h5 className="mb-3">Academic Information</h5>
                    <div className="row mb-3">
                      <div className="col">
                        <select
                          name="appliedClass"
                          className="form-select"
                          value={formData.appliedClass}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Class</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={`${i + 1}th`}>{`${i + 1}th`}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="academicYear"
                          className="form-control"
                          value={formData.academicYear}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Parent / Guardian */}
                    <h5 className="mb-3">Parent / Guardian</h5>
                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="text"
                          name="fatherName"
                          placeholder="Father Name"
                          className="form-control"
                          value={formData.fatherName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="fatherOccupation"
                          placeholder="Father Occupation"
                          className="form-control"
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="tel"
                          name="fatherPhone"
                          placeholder="Father Phone"
                          className="form-control"
                          value={formData.fatherPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="text"
                          name="motherName"
                          placeholder="Mother Name"
                          className="form-control"
                          value={formData.motherName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="motherOccupation"
                          placeholder="Mother Occupation"
                          className="form-control"
                          value={formData.motherOccupation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col">
                        <input
                          type="tel"
                          name="motherPhone"
                          placeholder="Mother Phone"
                          className="form-control"
                          value={formData.motherPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Previous School */}
                    <h5 className="mb-3">Previous School</h5>
                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="text"
                          name="previousSchool"
                          placeholder="Previous School Name"
                          className="form-control"
                          value={formData.previousSchool}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="previousClass"
                          placeholder="Previous Class"
                          className="form-control"
                          value={formData.previousClass}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          name="previousMarks"
                          placeholder="Marks %"
                          className="form-control"
                          value={formData.previousMarks}
                          onChange={handleChange}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="text-center mt-4">
                      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Side Card */}
                <div className="col-lg-4 d-none d-lg-block">
                  <div className="card h-100 shadow-sm">
                    
                    <div className="card-body">
                      <h5 className="card-title">How to Apply</h5>
                      <p className="small">Fill the form and submit. You'll receive an application number and follow-up details via email.</p>
                      <ul className="small">
                        <li>Keep scanned copies of certificates ready.</li>
                        <li>Ensure contact details are correct.</li>
                        <li>For assistance, call +91 9876543210.</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
