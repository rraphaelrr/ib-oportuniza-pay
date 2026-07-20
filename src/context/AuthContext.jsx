import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "@op_pay_session";

/**
 * AuthProvider
 * Guarda o usuário autenticado em memória + localStorage,
 * disponibilizando login/logout para toda a aplicação.
 *
 * Em produção, troque a simulação de `login()` por uma chamada
 * real ao seu backend (fetch/axios) e guarde apenas o token,
 * nunca a senha/PIN do usuário.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (_) {
      // ignora sessão corrompida
    } finally {
      setLoading(false);
    }
  }, []);

  async function login({ tipo, usuario, senha }) {
    // ── Simulação de chamada a API ──────────────────────────────
    // Troque este bloco por: const res = await api.post('/login', {...})
    await new Promise((resolve) => setTimeout(resolve, 600));

    const fakeUser = {
      nome: "Usuário Oportuniza",
      tipo,
      usuario,
      token: "fake-jwt-token",
    };

    setUser(fakeUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser));
    return fakeUser;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
