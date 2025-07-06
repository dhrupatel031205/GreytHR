import React from "react";
import {
  FaIdCard,
  FaFileAlt,
  FaPassport,
  FaUniversity,
  FaFileUpload,
  FaUserGraduate,
  FaFilePdf,
} from "react-icons/fa";

export default function S6Docs({ formData, updateForm }) {
  const handleFileChange = (e) => {
    updateForm({ [e.target.name]: e.target.files[0] });
  };

  return (
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 6: Document Uploads
      </h4>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">
            <FaIdCard className="me-2" />
            Aadhaar Card (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="aadhaar"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaFileAlt className="me-2" />
            PAN Card (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="pan"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaPassport className="me-2" />
            Passport (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="passport"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaUniversity className="me-2" />
            10th Marksheet (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="tenthMarksheet"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaUniversity className="me-2" />
            12th Marksheet (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="twelfthMarksheet"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaUserGraduate className="me-2" />
            Graduation Marksheet (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control"
            name="graduationMarksheet"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaFilePdf className="me-2" />
            Resume
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-control"
            name="resume"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaFileUpload className="me-2" />
            Offer Letter
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-control"
            name="offerLetter"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
