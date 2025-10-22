import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";
import PasswordInput from "../InputFields/PasswordInput";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    agentName: "",
    email: "",
    password: "",
    publisherName: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerUser(formData);
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4">Registration Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Agent Name</label>
            <input
              type="text"
              className="form-control"
              name="agentName"
              placeholder="Enter your name"
              value={formData.agentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Publisher Name</label>
            <input
              type="text"
              className="form-control"
              name="publisherName"
              placeholder="Enter your Publisher Name"
              value={formData.publisherName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="text-muted small">
              Password must be at least 8 characters, with an uppercase letter,
              lowercase letter, number, and special character.
            </span>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="mt-4">
            Already have an account?
            <Link className="ms-3" to="/login">
              Login Here
            </Link>
          </p>{" "}
        </form>
      </div>
    </div>
  );
};

export default Register;
