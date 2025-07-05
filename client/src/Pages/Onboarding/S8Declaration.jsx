import React, { useState } from 'react';

export default function S8Declaration({ formData, updateForm }) {
  const [accepted, setAccepted] = useState(false);

  const handleCheckbox = (e) => {
    setAccepted(e.target.checked);
    updateForm({ acceptedPolicies: e.target.checked });
  };

  const handleChange = (e) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accepted) {
      alert("Please accept the policies to continue.");
      return;
    }

    // Simulate submission (you can call your backend API here)
    console.log("Submitting onboarding data:", formData);
    alert("🎉 Onboarding completed successfully!");
    // Redirect to dashboard, etc.
  };

  return (
    <>
      <h4 className="mb-4">Step 8: Declaration & Submit</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <p>
            I hereby declare that the information provided above is true and correct to the best of my knowledge.
            I accept and agree to follow the company's policies and terms.
          </p>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="policyCheck"
            checked={accepted}
            onChange={handleCheckbox}
          />
          <label className="form-check-label" htmlFor="policyCheck">
            I accept the company policies.
          </label>
        </div>

        <div className="mb-3">
          <label>Type Full Name as E-signature</label>
          <input
            className="form-control"
            name="signature"
            value={formData.signature || ''}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          ✅ Submit Onboarding
        </button>
      </form>
    </>
  );
}
