import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute";
import LoginScreen from "../pages/Login/LoginScreen";
import Home from "../pages/Home/Home";
import Cadastro from "../pages/cadastro/Cadastro";
import Extrato from "../pages/Extrato/Extrato";
import Pix from "../pages/Pix/Pix";

/**
 * Todas as rotas da aplicação ficam centralizadas aqui.
 * Para adicionar uma nova rota INTERNA (que exige login),
 * basta seguir o padrão da rota "/home":
 *
 *   <Route
 *     path="/extrato"
 *     element={
 *       <ProtectedRoute>
 *         <Extrato />
 *       </ProtectedRoute>
 *     }
 *   />
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginScreen />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/Cadastro"
        element={
          <PublicOnlyRoute>
            <Cadastro />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/extrato"
        element={
          <ProtectedRoute>
            <Extrato />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pix"
        element={
          <ProtectedRoute>
            <Pix />
          </ProtectedRoute>
        }
      />
      {/* Qualquer rota desconhecida cai no login/redirecionamento */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
