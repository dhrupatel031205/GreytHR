import React, { useState } from "react";

export default function S2Address({ formData, updateForm }) {
  const [postOffices, setPostOffices] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value;

    // Allow only numbers, max 6 digits
    if (!/^\d{0,6}$/.test(value)) return;

    updateForm({ pincode: value });

    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();

        if (data[0].Status === "Success") {
          const poList = data[0].PostOffice || [];
          setPostOffices(poList);

          const firstPO = poList[0] || {};
          updateForm({
            area: firstPO.Name || "",
            city: firstPO.District || "",
            state: firstPO.State || "",
          });
        } else {
          setPostOffices([]);
          updateForm({ area: "", city: "", state: "" });
        }
      } catch (err) {
        console.error("Pincode API error", err);
        setPostOffices([]);
        updateForm({ area: "", city: "", state: "" });
      }
    } else {
      // Clear if less than 6 digits
      setPostOffices([]);
      updateForm({ area: "", city: "", state: "" });
    }
  };

  const handleAreaChange = (e) => {
    const selectedName = e.target.value;
    const selectedPO = postOffices.find((po) => po.Name === selectedName);

    updateForm({
      area: selectedName,
      city: selectedPO?.District || "",
      state: selectedPO?.State || "",
    });
  };

  return (
    <>
      <h4 className="mb-4 text-center text-primary fw-bold">
        Step 2: Address Information
      </h4>

      <div className="row g-3">
        <div className="col-md-12">
          <label>Current Address *</label>
          <textarea
            className="form-control"
            name="currentAddress"
            rows={2}
            value={formData.currentAddress || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12">
          <label>Permanent Address *</label>
          <textarea
            className="form-control"
            name="permanentAddress"
            rows={2}
            value={formData.permanentAddress || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label>Pincode *</label>
          <input
            type="text"
            className="form-control"
            name="pincode"
            placeholder="Enter 6-digit pincode"
            value={formData.pincode || ""}
            onChange={handlePincodeChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label>Area (Post Office) *</label>
          <select
            className="form-select"
            name="area"
            value={formData.area || ""}
            onChange={handleAreaChange}
            required
          >
            <option value="">Select Area</option>
            {postOffices.map((po, idx) => (
              <option key={idx} value={po.Name}>
                {po.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label>City *</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city || ""}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label>State *</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={formData.state || ""}
            readOnly
          />
        </div>
      </div>
    </>
  );
}
