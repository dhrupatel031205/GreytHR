import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaPenFancy } from 'react-icons/fa';

export default function S8Declaration({ formData, updateForm }) {
  const [accepted, setAccepted] = useState(false);
  const sigCanvasRef = useRef();

  const handleCheckbox = (e) => {
    setAccepted(e.target.checked);
    updateForm({ acceptedPolicies: e.target.checked });
  };

  const handleChange = (e) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    sigCanvasRef.current.clear();
    updateForm({ drawnSignature: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!accepted) {
      alert("Please accept the policies to continue.");
      return;
    }

    if (!formData.signature) {
      alert("Please enter your full name as e-signature.");
      return;
    }

    const drawnSignatureData = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
    updateForm({ drawnSignature: drawnSignatureData });

    console.log("✅ Final Submission Data:", {
      ...formData,
      drawnSignature: drawnSignatureData,
    });

    alert("🎉 Onboarding completed successfully!");
    // Redirect or backend call here
  };

  return (
    <>
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 8: Declaration & Submit
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <p className="text-muted">
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

        <div className="mb-4">
          <label className="form-label">Type Full Name as E-signature *</label>
          <div className="input-group">
            <span className="input-group-text"><FaPenFancy /></span>
            <input
              type="text"
              className="form-control"
              name="signature"
              value={formData.signature || ''}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Or Draw Signature</label>
          <div className="border rounded-3 p-2 bg-light" style={{ maxWidth: "320px" }}>
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 300,
                height: 80,
                className: "sigCanvas w-100 border rounded"
              }}
              ref={sigCanvasRef}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={handleClear}
            >
              Clear Signature
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3">
          ✅ Submit Onboarding
        </button>
      </form>
    </>
  );
}
