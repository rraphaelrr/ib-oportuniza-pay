import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { clearCacheEvery24Hours } from "./utils/clearCache";

export default function App() {
  useEffect(() => {
    clearCacheEvery24Hours();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}