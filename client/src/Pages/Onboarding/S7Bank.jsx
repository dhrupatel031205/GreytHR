import React from 'react';

export default function S7Bank({ formData, updateForm }) {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">Step 7: Bank Details</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Bank Name</label>
          <input
            className="form-control"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Account Number</label>
          <input
            className="form-control"
            name="accountNumber"
            value={formData.accountNumber || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>IFSC Code</label>
          <input
            className="form-control"
            name="ifsc"
            value={formData.ifsc || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>UPI ID</label>
          <input
            className="form-control"
            name="upi"
            value={formData.upi || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
