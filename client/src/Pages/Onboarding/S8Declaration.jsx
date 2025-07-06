import React, { useState } from "react";
import { FaPenFancy } from "react-icons/fa";
import axios from "axios";

export default function S8Declaration({ formData, updateForm }) {
  const [accepted, setAccepted] = useState(false);

  const handleCheckbox = (e) => {
    setAccepted(e.target.checked);
    updateForm({ acceptedPolicies: e.target.checked });
  };

  const handleChange = (e) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      personal: formData.personal,
      address: formData.address,
      family: formData.family,
      job: formData.job,
      education: formData.education,
      documents: formData.documents,
      bank: formData.bank,
      declaration: {
        signature: formData.signature,
        drawnSignature: "", // Removed drawn signature logic
        acceptedPolicies: formData.acceptedPolicies,
      },
    };

    try {
      const res = await axios.post("http://localhost:5000/api/onboarding", dataToSend);
      alert("✅ Onboarding submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Submission failed");
    }
  };

  return (
    <>
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 8: Declaration & Submit
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <p className="text-muted">
            I hereby declare that the information provided above is true and correct to the best of my knowledge. I accept and agree to follow the company's policies and terms.
          </p>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="policyCheck"
            checked={accepted}
            onChange={handleCheckbox}
            required
          />
          <label className="form-check-label" htmlFor="policyCheck">
            I accept the company policies.
          </label>
        </div>

        <div className="mb-4">
          <label className="form-label">Type Full Name as E-signature *</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaPenFancy />
            </span>
            <input
              type="text"
              className="form-control"
              name="signature"
              value={formData.signature || ""}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3">
          ✅ Submit Onboarding
        </button>
      </form>
    </>
  );
}
