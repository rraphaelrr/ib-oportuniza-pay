import axios from "axios";

const api = axios.create({
  /* baseURL: "https://api.tcbdigital.com.br/", */
  baseURL: "https://api.oportunizapay.com.br/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;