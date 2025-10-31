import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-education-backend.onrender.com", // Deployed Flask backend
});

// Example function to test API
export const getApiStatus = async () => {
  const res = await API.get("/");
  return res.data;
};

// Example function to submit "Get Involved" form
export const submitInvolvedForm = async (formData) => {
  const res = await API.post("/get-involved", formData);
  return res.data;
};
