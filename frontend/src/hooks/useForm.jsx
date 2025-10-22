import { useEffect, useState } from "react";
import { getAgentName } from "../utils/authStorage";
import { toast } from "react-toastify";
import axios from "axios";
const defaultFields = {
  fname: "",
  lname: "",
  phone: "",
  email: "",
  zipcode: "",
  city: "",
  state: "",
  address: "",
  agentName: "",
  campaign: "",
  dob: "",
  jornaya_leadid: "",
  ip_address: "",
  Age: "",
  income: "",
  gender:"",
  Optin_Timestamp:"",
  confirmedQLE:"",
};

export const useForm = () => {
  const [formData, setFormData] = useState(defaultFields);
  const [checkingPhone, setCheckingPhone] = useState(false);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      agentName: getAgentName() || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = async (e) => {
    const { value } = e.target;

    setFormData((prev) => ({ ...prev, phone: value }));
    let numericPhone = value.replace(/\D/g, "");
    if (numericPhone.length === 11 && numericPhone.startsWith("1")) {
      numericPhone = numericPhone.slice(1);
    }
    if (numericPhone.length === 10) {
      setCheckingPhone(true);
      try {
        const res = await axios.get(`/api/form/check?phone=${numericPhone}`);
        if (res.data.success) {
          const data = res.data.data;
          setFormData((prev) => ({
            ...prev,
            ...data,
            phone: value,
          }));
          toast.success("Auto-filled existing data.");
        } else {
          toast.info("New user – no data found.");
        }
      } catch (err) {
        console.error("Error fetching phone data:", err);
        toast.error("Failed to fetch data.");
      } finally {
        setCheckingPhone(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ...defaultFields,
      agentName: getAgentName() || "",
    });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handlePhoneChange,
    resetForm,
    checkingPhone,
  };
};
