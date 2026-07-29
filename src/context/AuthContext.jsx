import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";


const AuthContext = createContext(null);

const STORAGE_KEY = "@op_pay_session";


export function AuthProvider({ children }) {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    try {

      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setUser(JSON.parse(raw));
      }

    } catch (_) {

      localStorage.clear();

    } finally {

      setLoading(false);

    }

  }, []);



  async function login({ tipo, usuario, senha }) {

    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );


    const fakeUser = {

      nome: "Usuário Oportuniza",

      tipo,

      usuario,

      token: "fake-jwt-token",

    };


    setUser(fakeUser);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(fakeUser)
    );


    return fakeUser;

  }



  function logout() {

    // limpa estado React
    setUser(null);


    // remove absolutamente tudo salvo
    localStorage.clear();


    // limpa sessão temporária
    sessionStorage.clear();


    // volta para login
    navigate("/login", {
      replace: true,
    });

  }



  const value = {

    user,

    isAuthenticated: !!user,

    loading,

    login,

    logout,

  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

}



export function useAuth() {

  const ctx = useContext(AuthContext);


  if (!ctx) {

    throw new Error(
      "useAuth deve ser usado dentro de <AuthProvider>"
    );

  }


  return ctx;

}