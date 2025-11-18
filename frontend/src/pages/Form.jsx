import React, { useState } from "react";
import InputFields from "../InputFields/InputFields";
import { usStates } from "../utils/usStates";
import { useForm } from "../hooks/useForm";
import Navbar from "./../components/Navbar";
import Loader from "../components/Loader";
import { submitForm } from "../services/authService";
import { toast } from "react-toastify";
import { campaignRelations } from "../Relation/campaignRelations";
import { getPublisherName, getAgentName } from "../utils/authStorage";
import { ringbaId } from "../Api/ringbaUrls";
import { FaRegCopy } from "react-icons/fa";
const Form = () => {
  const {
    formData,
    handleChange,
    resetForm,
    handlePhoneChange,
    checkingPhone,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const publisher = (getPublisherName() || "").trim();
  const campaign = formData.campaign;
  const agentName = getAgentName();
  const campaigns = campaignRelations[publisher] || [];
  const [ringbaPhone, setRingbaPhone] = useState("");
  const [bidId, setBidId] = useState("");
  const [showCallStatus, setShowCallStatus] = useState(false);
  const handleSubmit = async (e, forceRetry = false) => {
    e.preventDefault();
    setLoading(true);
    setRingbaPhone("");
    setBidId("");
    setShowCallStatus(false);

    try {
      const isExempted =
        (publisher === "BaliTech" || publisher === "BT02") &&
        campaign === "OAK Lead";
      const ringbaIdForCampaign = ringbaId[publisher]?.[campaign];

      if (!ringbaIdForCampaign && !isExempted) {
        toast.error("Invalid campaign or publisher selected!");
        return;
      }

      let cleanedPhone = formData.phone.replace(/\D/g, "");
      if (cleanedPhone.length === 11 && cleanedPhone.startsWith("1")) {
        cleanedPhone = cleanedPhone.slice(1);
      }
      if (cleanedPhone.length !== 10) {
        toast.error("Please enter a valid 10-digit phone number.");
        return;
      }

      const submitData = {
        ...formData,
        phone: cleanedPhone,
        publisher,
        agentName,
        campaign,
        ringbaId: ringbaIdForCampaign || "",
        forceRetry,
      };

      const response = await submitForm(submitData);
      const fullResponse = response.data;
      console.log("Full Response:", fullResponse);

      const { ringbaResponse, bidId } = fullResponse;
      const phone = ringbaResponse?.phoneNumber;

      if (!bidId) {
        toast.error("Form submission failed: No BidId returned.");
        return;
      }
      setBidId(bidId);
      setRingbaPhone(phone || "");
      setShowCallStatus(true);
      if (!phone) {
        toast.error(`No agents available. BidId: ${bidId}`);
      } else {
        toast.success("Form submitted successfully!");
        resetForm();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Error submitting form"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Phone number copied!");
      })
      .catch((err) => {
        toast.error("Failed to copy.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="card shadow p-4 w-75">
            <h3 className="mb-4 text-center">Customer Details</h3>
            <p class="text-danger">
              Please select a campaign name before filling out the form.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 position-relative">
                  <InputFields
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      handleChange(e);
                      handlePhoneChange(e);
                    }}
                    placeholder="123-456-7890"
                  />
                  {checkingPhone && (
                    <div
                      className="position-absolute"
                      style={{
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <Loader size="sm" />
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <InputFields
                    label="Campaign Name"
                    type="select"
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleChange}
                    options={campaigns}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <InputFields
                    label="First Name"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>
                <div className="col-md-6">
                  <InputFields
                    label="Last Name"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <InputFields
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@example.com"
                  />
                </div>
                {!["BaliTech", " BT02", "FE-ENG-CPA-RTB","NXTBPO"].includes(
                  campaign
                ) && (
                  <div className="col-md-6">
                    <InputFields
                      label="Income"
                      name="income"
                      type="number"
                      value={formData.income}
                      onChange={handleChange}
                      placeholder="14000"
                      min={14000}
                      required
                    />
                  </div>
                )}
                {formData.income >= 20000 && (
                  <div className="col-md-6">
                    <InputFields
                      label="Confirmed QLE (Last 60 days: moved, new job, lost job, married, divorced, had a child, lost Medicaid, lost insurance coverage)"
                      name="QLE"
                      type="select"
                      value={formData.QLE}
                      onChange={handleChange}
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-md-4">
                  <InputFields
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <select
                      className="form-select"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {Object.entries(usStates).map(([abbr, name]) => (
                        <option key={abbr} value={abbr}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <small style={{ color: "red", fontSize: "10px" }}>
                      Only thsee states are allowed
                    </small>
                  </div>
                </div>
                <div className="col-md-4">
                  <InputFields
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <InputFields
                    label="Zip Code"
                    type="number"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <InputFields
                    label="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    min="1920-01-01"
                    max="2007-07-18"
                  />
                </div>
                <div className="col-md-4">
                  <InputFields
                    label="Age"
                    type="text"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    placeholder="Age"
                  />
                </div>
              </div>
              {!["BaliTech", "BT02", "Assured", "Quativa"].includes(
                publisher
              ) && (
                <div className="row">
                  <div className="col-md-6">
                    <InputFields
                      label="jornaya_leadid"
                      type="text"
                      name="jornaya_leadid"
                      value={formData.jornaya_leadid}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputFields
                      label="ip_address"
                      type="text"
                      name="ip_address"
                      value={formData.ip_address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              {["BT02", "Leads Expert"].includes(publisher) && (
                <div className="row">
                  <div className="col-md-6">
                    <InputFields
                      label="gender"
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              {["Leads Expert"].includes(publisher) && (
                <div className="row">
                  <div className="col-md-6">
                    <InputFields
                      label="Optin_Timestamp"
                      type="datetime-local"
                      name="Optin_Timestamp"
                      value={formData.Optin_Timestamp}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary w-50 mt-3"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader size="sm" message="Submitting..." />
                  ) : (
                    "Submit"
                  )}
                </button>
                {!loading && bidId && !ringbaPhone && (
                  <button
                    type="button"
                    className="btn btn-warning w-48 mt-2"
                    onClick={(e) => handleSubmit(e, true)}
                  >
                    Retry
                  </button>
                )}
              </div>
              {showCallStatus && (
                <>
                  {ringbaPhone ? (
                    <p className="mt-2 text-success d-flex align-items-center gap-2">
                      Transfer call to: <strong>{ringbaPhone}</strong>
                      <FaRegCopy
                        style={{ cursor: "pointer" }}
                        onClick={() => copyToClipboard(ringbaPhone)}
                        title="Copy to clipboard"
                      />
                    </p>
                  ) : (
                    <p className="mt-2 text-danger">
                      Call rejected: <strong>No Agents Available</strong>
                    </p>
                  )}

                  {bidId && (
                    <p className="mt-1 text-muted">
                      <strong>Bid ID:</strong> {bidId}
                    </p>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
