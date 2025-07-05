import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars } from "react-icons/fa";

export default function S1Personal({ formData, updateForm }) {
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const list = data
          .filter(
            (c) =>
              c.idd && c.idd.root && c.idd.suffixes && c.idd.suffixes.length > 0
          )
          .map((c) => ({
            name: c.name.common,
            code: `${c.idd.root}${c.idd.suffixes[0]}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(list);
      })
      .catch((err) => console.error("Country fetch failed", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "firstName" && !value.trim()) {
      newErrors.firstName = "First name is required";
    } else {
      delete newErrors.firstName;
    }

    if (name === "lastName" && !value.trim()) {
      newErrors.lastName = "Last name is required";
    } else {
      delete newErrors.lastName;
    }

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email address";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "phone") {
      const phoneRegex = /^[6-9][0-9]{9}$/;
      if (!value.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(value)) {
        newErrors.phone = "Phone must be 10 digits and start with 6–9";
      } else {
        delete newErrors.phone;
      }
    }

    if (name === "dob") {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      const is18OrOlder =
        age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      if (!value.trim()) {
        newErrors.dob = "Date of birth is required";
      } else if (!is18OrOlder) {
        newErrors.dob = "User must be at least 18 years old";
      } else {
        delete newErrors.dob;
      }
    }

    if (name === "gender" && !value.trim()) {
      newErrors.gender = "Gender is required";
    } else {
      delete newErrors.gender;
    }

    setErrors(newErrors);
  };

  return (
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 1: Personal Information
      </h4>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">First Name *</label>
          <div className="input-group">
            <span className="input-group-text"><FaUser /></span>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label">Middle Name</label>
          <input
            className="form-control"
            name="middleName"
            value={formData.middleName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Last Name *</label>
          <div className="input-group">
            <span className="input-group-text"><FaUser /></span>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <div className="input-group">
            <span className="input-group-text"><FaEnvelope /></span>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone Number *</label>
          <div className="input-group">
            <select
              className="form-select"
              name="countryCode"
              value={formData.countryCode || ""}
              onChange={handleChange}
              style={{ maxWidth: "120px" }}
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
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Enter 10-digit number"
            />
          </div>
          {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Date of Birth *</label>
          <div className="input-group">
            <span className="input-group-text"><FaCalendar /></span>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
            />
          </div>
          {errors.dob && <div className="invalid-feedback d-block">{errors.dob}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender *</label>
          <div className="input-group">
            <span className="input-group-text"><FaVenusMars /></span>
            <select
              className={`form-select ${errors.gender ? "is-invalid" : ""}`}
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
        </div>
      </div>
    </div>
  );
}
