import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaBriefcase,
} from "react-icons/fa";

export default function S3Family({ formData, updateForm }) {
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const list = data
          .filter((c) => c.idd?.root && c.idd?.suffixes?.length > 0)
          .map((c) => ({
            name: c.name.common,
            code: `${c.idd.root}${c.idd.suffixes[0]}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch((err) => console.error("Country fetch failed", err));
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    const phoneRegex = /^[6-9][0-9]{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name.includes("Email")) {
      if (!value) newErrors[name] = "Email is required";
      else if (!emailRegex.test(value))
        newErrors[name] = "Enter a valid email";
      else delete newErrors[name];
    }

    if (name.includes("Phone")) {
      if (!value) newErrors[name] = "Phone number is required";
      else if (!phoneRegex.test(value))
        newErrors[name] = "Must be 10 digits starting with 6–9";
      else delete newErrors[name];
    }

    if (name.includes("Dob")) {
      if (!value) newErrors[name] = "DOB is required";
      else {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const month = today.getMonth() - dob.getMonth();
        const day = today.getDate() - dob.getDate();
        const is18OrOlder =
          age > 18 || (age === 18 && (month > 0 || (month === 0 && day >= 0)));

        if (!is18OrOlder) newErrors[name] = "Must be at least 18 years old";
        else delete newErrors[name];
      }
    }

    if (name.includes("FirstName") || name.includes("LastName")) {
      if (!value.trim()) newErrors[name] = "This field is required";
      else delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
    validateField(name, value);
  };

  const renderMemberSection = (prefix, label) => (
    <div className="border rounded p-3 mb-4">
      <h5 className="text-primary">{label} Details</h5>
      <div className="row g-3 mt-1">
        <div className="col-md-4">
          <label>First Name *</label>
          <input
            className={`form-control ${errors[`${prefix}FirstName`] ? "is-invalid" : ""}`}
            name={`${prefix}FirstName`}
            value={formData[`${prefix}FirstName`] || ""}
            onChange={handleChange}
          />
          {errors[`${prefix}FirstName`] && (
            <div className="invalid-feedback">{errors[`${prefix}FirstName`]}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>Middle Name</label>
          <input
            className="form-control"
            name={`${prefix}MiddleName`}
            value={formData[`${prefix}MiddleName`] || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Last Name *</label>
          <input
            className={`form-control ${errors[`${prefix}LastName`] ? "is-invalid" : ""}`}
            name={`${prefix}LastName`}
            value={formData[`${prefix}LastName`] || ""}
            onChange={handleChange}
          />
          {errors[`${prefix}LastName`] && (
            <div className="invalid-feedback">{errors[`${prefix}LastName`]}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>Email *</label>
          <input
            className={`form-control ${errors[`${prefix}Email`] ? "is-invalid" : ""}`}
            name={`${prefix}Email`}
            value={formData[`${prefix}Email`] || ""}
            onChange={handleChange}
          />
          {errors[`${prefix}Email`] && (
            <div className="invalid-feedback">{errors[`${prefix}Email`]}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>Phone Number *</label>
          <div className="input-group">
            <select
              className="form-select"
              name={`${prefix}PhoneCode`}
              value={formData[`${prefix}PhoneCode`] || ""}
              onChange={handleChange}
              style={{ maxWidth: "100px" }}
            >
              <option value="">Code</option>
              {countries.map((c, i) => (
                <option key={i} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <input
              type="tel"
              className={`form-control ${errors[`${prefix}Phone`] ? "is-invalid" : ""}`}
              name={`${prefix}Phone`}
              value={formData[`${prefix}Phone`] || ""}
              onChange={handleChange}
              placeholder="10-digit number"
            />
          </div>
          {errors[`${prefix}Phone`] && (
            <div className="invalid-feedback d-block">{errors[`${prefix}Phone`]}</div>
          )}
        </div>
        <div className="col-md-4">
          <label>Date of Birth *</label>
          <input
            type="date"
            className={`form-control ${errors[`${prefix}Dob`] ? "is-invalid" : ""}`}
            name={`${prefix}Dob`}
            value={formData[`${prefix}Dob`] || ""}
            onChange={handleChange}
          />
          {errors[`${prefix}Dob`] && (
            <div className="invalid-feedback">{errors[`${prefix}Dob`]}</div>
          )}
        </div>
        <div className="col-md-6">
          <label>Occupation</label>
          <input
            className="form-control"
            name={`${prefix}Occupation`}
            value={formData[`${prefix}Occupation`] || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h4 className="mb-4 text-primary fw-bold text-center">
        Step 3: Family Background
      </h4>

      <div className="mb-3 form-check form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          checked={formData.isFatherAvailable !== false}
          onChange={(e) =>
            updateForm({ isFatherAvailable: e.target.checked })
          }
        />
        <label className="form-check-label">Is Father Available?</label>
      </div>
      {formData.isFatherAvailable !== false && renderMemberSection("father", "Father")}

      <div className="mb-3 form-check form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          checked={formData.isMotherAvailable !== false}
          onChange={(e) =>
            updateForm({ isMotherAvailable: e.target.checked })
          }
        />
        <label className="form-check-label">Is Mother Available?</label>
      </div>
      {formData.isMotherAvailable !== false && renderMemberSection("mother", "Mother")}

      <div className="mb-4">
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

      {formData.maritalStatus === "Married" &&
        renderMemberSection("spouse", "Spouse")}

      <div className="border rounded p-3">
        <h5 className="text-primary">Emergency Contact</h5>
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label>Name</label>
            <input
              className="form-control"
              name="emergencyName"
              value={formData.emergencyName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Relation</label>
            <select
              className="form-select"
              name="emergencyRelation"
              value={formData.emergencyRelation || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Phone Number *</label>
            <div className="input-group">
              <select
                className="form-select"
                name="emergencyCode"
                value={formData.emergencyCode || ""}
                onChange={handleChange}
                style={{ maxWidth: "100px" }}
              >
                <option value="">Code</option>
                {countries.map((c, i) => (
                  <option key={i} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className={`form-control ${errors.emergencyPhone ? "is-invalid" : ""}`}
                name="emergencyPhone"
                value={formData.emergencyPhone || ""}
                onChange={handleChange}
              />
            </div>
            {errors.emergencyPhone && (
              <div className="invalid-feedback d-block">{errors.emergencyPhone}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
