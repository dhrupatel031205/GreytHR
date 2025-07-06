import React, { useState } from "react";
import {
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaPercentage,
  FaBriefcase,
  FaBuilding,
} from "react-icons/fa";

export default function S5Education({ formData, updateForm }) {
  const [errors, setErrors] = useState({});
  const years = Array.from({ length: 2026 - 1970 + 1 }, (_, i) => 2026 - i);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
    validate(name, value);
  };

  const validate = (name, value) => {
    const newErrors = { ...errors };

    if (name.includes("Score")) {
      const type = formData[`${name.replace("Score", "Type")}`];
      const score = parseFloat(value);

      if (!value.trim()) {
        newErrors[name] = "Score is required";
      } else if (type === "CGPA" && (score > 10 || score < 0)) {
        newErrors[name] = "CGPA must be between 0 and 10";
      } else if (type === "Percentage" && (score > 100 || score < 0)) {
        newErrors[name] = "Percentage must be between 0 and 100";
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...(formData.experiences || [])];
    updated[index][field] = value;
    updateForm({ experiences: updated });
  };

  const addExperience = () => {
    const newExp = {
      company: "",
      title: "",
      from: "",
      to: "",
      years: "",
    };
    updateForm({ experiences: [...(formData.experiences || []), newExp] });
  };

  const removeExperience = (index) => {
    const updated = [...(formData.experiences || [])];
    updated.splice(index, 1);
    updateForm({ experiences: updated });
  };

  return (
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 5: Education & Experience
      </h4>

      {/* 10th Education */}
      <h5 className="text-secondary mt-3">10th Standard</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <label>School Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUniversity />
            </span>
            <input
              className="form-control"
              name="tenthInstitute"
              value={formData.tenthInstitute || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <label>Year</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <select
              className="form-select"
              name="tenthYear"
              value={formData.tenthYear || ""}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label>Score</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaPercentage />
            </span>
            <input
              className={`form-control ${errors.tenthScore ? "is-invalid" : ""}`}
              name="tenthScore"
              value={formData.tenthScore || ""}
              onChange={handleChange}
            />
            <select
              className="form-select"
              name="tenthType"
              value={formData.tenthType || ""}
              onChange={handleChange}
              style={{ maxWidth: "100px" }}
            >
              <option value="">Type</option>
              <option value="Percentage">%</option>
              <option value="CGPA">CGPA</option>
            </select>
          </div>
          {errors.tenthScore && (
            <div className="invalid-feedback d-block">{errors.tenthScore}</div>
          )}
        </div>
      </div>

      {/* 12th Education */}
      <h5 className="text-secondary mt-4">12th Standard</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <label>School Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUniversity />
            </span>
            <input
              className="form-control"
              name="twelfthInstitute"
              value={formData.twelfthInstitute || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <label>Year</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <select
              className="form-select"
              name="twelfthYear"
              value={formData.twelfthYear || ""}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label>Score</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaPercentage />
            </span>
            <input
              className={`form-control ${errors.twelfthScore ? "is-invalid" : ""}`}
              name="twelfthScore"
              value={formData.twelfthScore || ""}
              onChange={handleChange}
            />
            <select
              className="form-select"
              name="twelfthType"
              value={formData.twelfthType || ""}
              onChange={handleChange}
              style={{ maxWidth: "100px" }}
            >
              <option value="">Type</option>
              <option value="Percentage">%</option>
              <option value="CGPA">CGPA</option>
            </select>
          </div>
          {errors.twelfthScore && (
            <div className="invalid-feedback d-block">{errors.twelfthScore}</div>
          )}
        </div>
      </div>

      {/* Graduation */}
      <h5 className="text-secondary mt-4">Graduation</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <label>Qualification</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaGraduationCap />
            </span>
            <input
              className="form-control"
              name="qualification"
              value={formData.qualification || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <label>University/College</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUniversity />
            </span>
            <input
              className="form-control"
              name="university"
              value={formData.university || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <label>Year</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <select
              className="form-select"
              name="graduationYear"
              value={formData.graduationYear || ""}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <h5 className="text-secondary mt-4">Work Experience</h5>
      <div className="mb-3">
        <label>Do you have experience?</label>
        <select
          className="form-select"
          name="hasExperience"
          value={formData.hasExperience || ""}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {formData.hasExperience === "Yes" && (
        <>
          {(formData.experiences || []).map((exp, index) => (
            <div key={index} className="border p-3 rounded mb-3 bg-light">
              <h6 className="fw-semibold mb-3">
                <FaBriefcase className="me-2" />
                Experience {index + 1}
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label>Company</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaBuilding />
                    </span>
                    <input
                      className="form-control"
                      value={exp.company}
                      onChange={(e) =>
                        handleExperienceChange(index, "company", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label>Title</label>
                  <input
                    className="form-control"
                    value={exp.title}
                    onChange={(e) =>
                      handleExperienceChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label>From</label>
                  <input
                    type="month"
                    className="form-control"
                    value={exp.from}
                    onChange={(e) =>
                      handleExperienceChange(index, "from", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label>To</label>
                  <input
                    type="month"
                    className="form-control"
                    value={exp.to}
                    onChange={(e) =>
                      handleExperienceChange(index, "to", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label>Total Years</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={exp.years}
                    onChange={(e) =>
                      handleExperienceChange(index, "years", e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-danger btn-sm mt-3"
                onClick={() => removeExperience(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary mt-2"
            onClick={addExperience}
          >
            + Add Another Experience
          </button>
        </>
      )}
    </div>
  );
}
