import React, { useState } from "react";

export default function S3Family({ formData, updateForm }) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });

    // Validation
    if (name.includes("Phone")) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Enter valid 10-digit phone",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (name.includes("Email")) {
      if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: "Enter valid email" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  return (
    <>
      <h4 className="mb-4 text-primary fw-bold">Step 3: Family Background</h4>
      <div className="row g-3">
        {/* Father */}
        <div className="col-12">
          <strong>Father's Details</strong>
        </div>
        <div className="col-md-4">
          <label>First Name</label>
          <input
            className="form-control"
            name="fatherFirstName"
            value={formData.fatherFirstName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Middle Name</label>
          <input
            className="form-control"
            name="fatherMiddleName"
            value={formData.fatherMiddleName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Last Name</label>
          <input
            className="form-control"
            name="fatherLastName"
            value={formData.fatherLastName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Phone</label>
          <input
            className={`form-control ${errors.fatherPhone ? "is-invalid" : ""}`}
            name="fatherPhone"
            value={formData.fatherPhone || ""}
            onChange={handleChange}
          />
          {errors.fatherPhone && (
            <div className="invalid-feedback">{errors.fatherPhone}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>Email</label>
          <input
            className={`form-control ${errors.fatherEmail ? "is-invalid" : ""}`}
            name="fatherEmail"
            value={formData.fatherEmail || ""}
            onChange={handleChange}
          />
          {errors.fatherEmail && (
            <div className="invalid-feedback">{errors.fatherEmail}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>DOB</label>
          <input
            className="form-control"
            type="date"
            name="fatherDob"
            value={formData.fatherDob || ""}
            onChange={handleChange}
          />
        </div>

        {/* Mother */}
        <div className="col-12 mt-4">
          <strong>Mother's Details</strong>
        </div>
        <div className="col-md-4">
          <label>First Name</label>
          <input
            className="form-control"
            name="motherFirstName"
            value={formData.motherFirstName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Middle Name</label>
          <input
            className="form-control"
            name="motherMiddleName"
            value={formData.motherMiddleName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Last Name</label>
          <input
            className="form-control"
            name="motherLastName"
            value={formData.motherLastName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Phone</label>
          <input
            className={`form-control ${errors.motherPhone ? "is-invalid" : ""}`}
            name="motherPhone"
            value={formData.motherPhone || ""}
            onChange={handleChange}
          />
          {errors.motherPhone && (
            <div className="invalid-feedback">{errors.motherPhone}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>Email</label>
          <input
            className={`form-control ${errors.motherEmail ? "is-invalid" : ""}`}
            name="motherEmail"
            value={formData.motherEmail || ""}
            onChange={handleChange}
          />
          {errors.motherEmail && (
            <div className="invalid-feedback">{errors.motherEmail}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>DOB</label>
          <input
            className="form-control"
            type="date"
            name="motherDob"
            value={formData.motherDob || ""}
            onChange={handleChange}
          />
        </div>

        {/* Marital */}
        <div className="col-md-6">
          <label>Marital Status</label>
          <select
            className="form-select"
            name="maritalStatus"
            value={formData.maritalStatus || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </div>

        {/* Spouse (Conditional) */}
        {formData.maritalStatus === "Married" && (
          <>
            <div className="col-12 mt-3">
              <strong>Spouse Details</strong>
            </div>
            <div className="col-md-4">
              <label>First Name</label>
              <input
                className="form-control"
                name="spouseFirstName"
                value={formData.spouseFirstName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label>Middle Name</label>
              <input
                className="form-control"
                name="spouseMiddleName"
                value={formData.spouseMiddleName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label>Last Name</label>
              <input
                className="form-control"
                name="spouseLastName"
                value={formData.spouseLastName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label>Phone</label>
              <input
                className={`form-control ${
                  errors.spousePhone ? "is-invalid" : ""
                }`}
                name="spousePhone"
                value={formData.spousePhone || ""}
                onChange={handleChange}
              />
              {errors.spousePhone && (
                <div className="invalid-feedback">{errors.spousePhone}</div>
              )}
            </div>
            <div className="col-md-4">
              <label>Email</label>
              <input
                className={`form-control ${
                  errors.spouseEmail ? "is-invalid" : ""
                }`}
                name="spouseEmail"
                value={formData.spouseEmail || ""}
                onChange={handleChange}
              />
              {errors.spouseEmail && (
                <div className="invalid-feedback">{errors.spouseEmail}</div>
              )}
            </div>
            <div className="col-md-4">
              <label>DOB</label>
              <input
                className="form-control"
                type="date"
                name="spouseDob"
                value={formData.spouseDob || ""}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* Emergency */}
        <div className="col-12 mt-4">
          <strong>Emergency Contact</strong>
        </div>

        <div className="col-md-4">
          <label>Name</label>
          <input
            className="form-control"
            name="emergencyContactName"
            value={formData.emergencyContactName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label>Phone</label>
          <input
            className={`form-control ${
              errors.emergencyContactPhone ? "is-invalid" : ""
            }`}
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone || ""}
            onChange={handleChange}
          />
          {errors.emergencyContactPhone && (
            <div className="invalid-feedback">
              {errors.emergencyContactPhone}
            </div>
          )}
        </div>

        <div className="col-md-4">
          <label>Relation</label>
          <select
            className="form-select"
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Spouse">Spouse</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </>
  );
}
