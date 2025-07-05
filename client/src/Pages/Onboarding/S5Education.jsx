import React from 'react';

export default function S5Education({ formData, updateForm }) {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">Step 5: Education & Experience</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Highest Qualification</label>
          <input
            className="form-control"
            name="qualification"
            value={formData.qualification || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>University / College Name</label>
          <input
            className="form-control"
            name="university"
            value={formData.university || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Year of Graduation</label>
          <input
            type="number"
            className="form-control"
            name="graduationYear"
            value={formData.graduationYear || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Total Experience (in years)</label>
          <input
            type="number"
            className="form-control"
            name="experienceYears"
            value={formData.experienceYears || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-12 mb-3">
          <label>Last Company Name</label>
          <input
            className="form-control"
            name="lastCompany"
            value={formData.lastCompany || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
