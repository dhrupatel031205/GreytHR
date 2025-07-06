import React, { useState } from "react";
import {
  FaUniversity,
  FaCode,
  FaBuilding,
  FaHashtag,
  FaIdBadge,
  FaMoneyCheckAlt,
} from "react-icons/fa";

export default function S7Bank({ formData, updateForm }) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });

    if (name === "ifsc" && value.length === 11) {
      fetch(`https://ifsc.razorpay.com/${value.toUpperCase()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Invalid IFSC");
          return res.json();
        })
        .then((data) => {
          updateForm({
            bankName: data.BANK,
            branch: data.BRANCH,
          });
          setError("");
        })
        .catch((err) => {
          setError("Invalid IFSC Code");
          updateForm({ bankName: "", branch: "" });
        });
    }
  };

  return (
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h4 className="mb-4 fw-bold text-primary text-center">
        Step 7: Bank Details
      </h4>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">
            <FaCode className="me-2" />
            IFSC Code *
          </label>
          <input
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            name="ifsc"
            value={formData.ifsc || ""}
            onChange={handleChange}
            placeholder="Enter IFSC (e.g., HDFC0000001)"
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaUniversity className="me-2" />
            Bank Name
          </label>
          <input
            type="text"
            className="form-control"
            name="bankName"
            value={formData.bankName || ""}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaBuilding className="me-2" />
            Branch
          </label>
          <input
            type="text"
            className="form-control"
            name="branch"
            value={formData.branch || ""}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaHashtag className="me-2" />
            Account Number *
          </label>
          <input
            type="text"
            className={`form-control ${
              formData.accountNumberError ? "is-invalid" : ""
            }`}
            name="accountNumber"
            value={formData.accountNumber || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (!/^\d*$/.test(value)) return;

              updateForm({ accountNumber: value });

              if (!value.trim()) {
                updateForm({
                  accountNumberError: "Account number is required",
                });
              } else if (value.length < 9 || value.length > 18) {
                updateForm({
                  accountNumberError: "Account number must be 9 to 18 digits",
                });
              } else {
                updateForm({ accountNumberError: "" });
              }
            }}
            placeholder="Enter your account number"
          />
          {formData.accountNumberError && (
            <div className="invalid-feedback">
              {formData.accountNumberError}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">
            <FaMoneyCheckAlt className="me-2" />
            UPI ID
          </label>
          <input
            className="form-control"
            name="upi"
            value={formData.upi || ""}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}
