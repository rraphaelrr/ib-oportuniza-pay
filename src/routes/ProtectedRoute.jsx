import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * Envolva qualquer rota interna com este componente.
 * Se não houver usuário autenticado, redireciona para /login
 * e guarda a rota de origem em location.state.from, para que o
 * login possa devolver o usuário para onde ele tentou ir.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="op-splash">
        <div className="op-splash-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

/**
 * PublicOnlyRoute
 * Usada na tela de login: se o usuário já estiver logado,
 * não faz sentido ver a tela de login de novo — manda pra Home.
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="op-splash">
        <div className="op-splash-spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
