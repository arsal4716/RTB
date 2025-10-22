import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { saveAuthData } from "../utils/authStorage";
import Loader from "../components/Loader";
import PasswordInput from "../InputFields/PasswordInput";
const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(formData);
      if (data.success) {
        saveAuthData(
          data.data.token,
          data.data.agentName,
          data.data.publisherName
        );
        toast.success(data.message);
        setTimeout(() => navigate("/form"), 2000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? <Loader text="Logging in..." size="sm" /> : "Login"}
          </button>
          <p className="mt-5">
            Don't have an account?
            <Link className="ms-3" to="/register">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
