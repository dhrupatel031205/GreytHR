import React from 'react';

export default function S6Dos({ formData, updateForm }) {
  const handleFileChange = (e) => {
    updateForm({ [e.target.name]: e.target.files[0] });
  };

  return (
    <>
      <h4 className="mb-4">Step 6: Document Uploads</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Aadhaar Card (PDF/JPG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="aadhaar"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>PAN Card (PDF/JPG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="pan"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-control"
            name="resume"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Offer Letter</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-control"
            name="offerLetter"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
}
