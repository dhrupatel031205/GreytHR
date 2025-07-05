import React from 'react';

    export default function S4Job({ formData, updateForm }) {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">Step 4: Job Details</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Department</label>
          <input
            className="form-control"
            name="department"
            value={formData.department || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Designation</label>
          <input
            className="form-control"
            name="designation"
            value={formData.designation || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Date of Joining</label>
          <input
            type="date"
            className="form-control"
            name="joiningDate"
            value={formData.joiningDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Manager's Name</label>
          <input
            className="form-control"
            name="managerName"
            value={formData.managerName || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
