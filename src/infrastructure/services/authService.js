import api from "../utils/axios";

const authService = {
  // login: (payload) => api.post(`/auth/loginAdmin`, payload),
  login: (payload) => api.post(`/adminAuth/login`, payload),
};

export default authService;
