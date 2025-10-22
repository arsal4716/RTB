import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthData, getAgentName } from '../utils/authStorage';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const agentName = getAgentName();
  const handleLogout = async () => {
    try {
      const data = await authService.logout();

      if (data.success) {
        clearAuthData();
        navigate('/login');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (err) {
      toast.error('Something went wrong during logout');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand mb-0 h1">AGENTS FORM</span>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-bold text-primary">
            {getAgentName() ? `Welcome, ${getAgentName()}` : ''}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
