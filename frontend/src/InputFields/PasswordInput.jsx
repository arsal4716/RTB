import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ name, value, onChange, placeholder = "Enter password", minLength = 8 }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label className="form-label" htmlFor={name}>Password</label>
      <div className="position-relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          className="form-control pe-5" 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          minLength={minLength}
        />
        <button
          type="button"
          className="btn position-absolute top-50 end-0 translate-middle-y p-0 me-2 border-0 bg-transparent"
          style={{ lineHeight: 1 }}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
