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
  // Convert file to Base64 string and update form
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateForm({ [name]: reader.result }); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 6: Document Uploads
      </h4>
      <div className="row g-3">
        {/* Aadhaar */}
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

        {/* PAN */}
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

        {/* Passport */}
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

        {/* 10th */}
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

        {/* 12th */}
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

        {/* Graduation */}
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

        {/* Resume */}
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

        {/* Offer Letter */}
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
