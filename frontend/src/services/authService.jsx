import axios from "axios";
import { getToken, clearAuthData } from "../utils/authStorage";

const API_URL = "/api/auth";

export const login = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/login`, credentials);
  return data;
};

export const registerUser = (userData) =>
  axios.post(`${API_URL}/register`, userData).then((res) => res.data);

export const logout = async () => {
  const token = getToken();
  const res = await axios.post(
    `${API_URL}/logout`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  clearAuthData();
  return res.data;
};



export const submitForm = (formData) => {
  const token = getToken();
  return axios
    .post("/api/form", formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

export default {
  login,
  registerUser,
  logout,
  submitForm,
};
