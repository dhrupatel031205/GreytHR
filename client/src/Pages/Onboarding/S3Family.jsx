import React from 'react';

export default function S3Family({ formData, updateForm }) {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">Step 3: Family Background</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Father's Name</label>
          <input className="form-control" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label>Mother's Name</label>
          <input className="form-control" name="motherName" value={formData.motherName || ''} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label>Marital Status</label>
          <select className="form-select" name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </div>
        {formData.maritalStatus === 'Married' && (
          <div className="col-md-6 mb-3">
            <label>Spouse Name</label>
            <input className="form-control" name="spouseName" value={formData.spouseName || ''} onChange={handleChange} />
          </div>
        )}
        <div className="col-md-6 mb-3">
          <label>Emergency Contact Name</label>
          <input className="form-control" name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label>Emergency Contact Phone</label>
          <input className="form-control" name="emergencyContactPhone" value={formData.emergencyContactPhone || ''} onChange={handleChange} />
        </div>
      </div>
    </>
  );
}
