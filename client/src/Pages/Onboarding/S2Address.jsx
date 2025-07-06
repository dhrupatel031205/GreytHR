import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaCity,
  FaGlobeAsia,
  FaMapPin,
} from "react-icons/fa";

export default function S2Address({ formData, updateForm }) {
  const [postOffices, setPostOffices] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value;

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
          <label className="form-label">Current Address *</label>
          <div className="input-group">
            <span className="input-group-text"><FaHome /></span>
            <textarea
              className="form-control"
              name="currentAddress"
              rows={2}
              value={formData.currentAddress || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-12">
          <label className="form-label">Permanent Address *</label>
          <div className="input-group">
            <span className="input-group-text"><FaBuilding /></span>
            <textarea
              className="form-control"
              name="permanentAddress"
              rows={2}
              value={formData.permanentAddress || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Pincode *</label>
          <div className="input-group">
            <span className="input-group-text"><FaMapPin /></span>
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
        </div>

        <div className="col-md-6">
          <label className="form-label">Area (Post Office) *</label>
          <div className="input-group">
            <span className="input-group-text"><FaMapMarkerAlt /></span>
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
        </div>

        <div className="col-md-6">
          <label className="form-label">City *</label>
          <div className="input-group">
            <span className="input-group-text"><FaCity /></span>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city || ""}
              readOnly
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">State *</label>
          <div className="input-group">
            <span className="input-group-text"><FaGlobeAsia /></span>
            <input
              type="text"
              className="form-control"
              name="state"
              value={formData.state || ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
}
