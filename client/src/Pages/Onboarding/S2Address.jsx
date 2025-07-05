import React from 'react';

    export default function S2Address({ formData, updateForm }) {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">Step 2: Address Information</h4>
      <div className="row">
        <div className="col-md-12 mb-3">
          <label>Current Address</label>
          <input className="form-control" name="currentAddress" value={formData.currentAddress || ''} onChange={handleChange} />
        </div>
        <div className="col-md-12 mb-3">
          <label>Permanent Address</label>
          <input className="form-control" name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label>City</label>
          <input className="form-control" name="city" value={formData.city || ''} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label>State</label>
          <input className="form-control" name="state" value={formData.state || ''} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label>Pincode</label>
          <input className="form-control" name="pincode" value={formData.pincode || ''} onChange={handleChange} />
        </div>
      </div>
    </>
  );
}
