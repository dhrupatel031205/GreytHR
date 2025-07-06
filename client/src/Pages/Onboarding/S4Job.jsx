import React from 'react';
import { FaBuilding, FaUserTie, FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function S4Job({ formData, updateForm }) {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4 text-primary fw-bold text-center">Step 4: Job Details</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Department</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaBuilding />
            </span>
            <input
              className="form-control"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label>Designation</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUserTie />
            </span>
            <input
              className="form-control"
              name="designation"
              value={formData.designation || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label>Date of Joining</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <input
              type="date"
              className="form-control"
              name="joiningDate"
              value={formData.joiningDate || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label>Manager's Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              className="form-control"
              name="managerName"
              value={formData.managerName || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
