import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const STORAGE_KEY = "@op_pay_session";
const LAST_CLOSE_KEY = "@op_pay_last_close";

// 5 minutos
const SESSION_TIMEOUT = 5 * 60 * 1000;

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * RESTAURAR SESSÃO
   * =========================================================
   *
   * A sessão permanece no localStorage para permitir:
   *
   * - F5
   * - atualização da página
   * - navegação entre páginas
   *
   * Porém, se o usuário ficou fora por mais de 5 minutos,
   * a sessão será apagada.
   */

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(STORAGE_KEY);
      const lastClose = localStorage.getItem(LAST_CLOSE_KEY);

      if (!rawSession) {
        setUser(null);
        setLoading(false);
        return;
      }

      let parsedUser;

      try {
        parsedUser = JSON.parse(rawSession);
      } catch (error) {
        console.error(
          "Sessão inválida:",
          error
        );

        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        setUser(null);
        setLoading(false);
        return;
      }

      /*
       * Verifica quanto tempo passou desde a última
       * saída/fechamento da página.
       */

      if (lastClose) {
        const elapsed =
          Date.now() - Number(lastClose);

        if (elapsed >= SESSION_TIMEOUT) {
          console.log(
            "Sessão expirada por inatividade."
          );

          clearSession();

          setUser(null);
          setLoading(false);

          return;
        }
      }

      /*
       * Sessão ainda válida
       */

      setUser(parsedUser);

      /*
       * Remove o marcador de fechamento.
       *
       * Assim, enquanto a aplicação estiver aberta,
       * não contamos esse período como tempo fechado.
       */

      localStorage.removeItem(LAST_CLOSE_KEY);
    } catch (error) {
      console.error(
        "Erro ao restaurar sessão:",
        error
      );

      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * =========================================================
   * LIMPAR SESSÃO
   * =========================================================
   */

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_CLOSE_KEY);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    localStorage.removeItem("user");

    sessionStorage.clear();
  }

  /*
   * =========================================================
   * LOGIN
   * =========================================================
   */

  async function login(userData) {
    if (!userData) {
      throw new Error(
        "Dados do usuário não informados."
      );
    }

    const authenticatedUser = {
      ...userData,

      nome:
        userData.nome ||
        userData.name ||
        "Usuário Oportuniza",

      usuario:
        userData.usuario ||
        userData.email ||
        "",
    };

    console.log(
      "Usuário autenticado:",
      authenticatedUser
    );

    setUser(authenticatedUser);

    /*
     * Salva a sessão para permitir F5.
     */

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(authenticatedUser)
    );

    /*
     * Remove qualquer marcação de fechamento anterior.
     */

    localStorage.removeItem(LAST_CLOSE_KEY);

    return authenticatedUser;
  }

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  function logout() {
    clearSession();

    setUser(null);

    navigate("/login", {
      replace: true,
    });
  }

  /*
   * =========================================================
   * DETECTAR SAÍDA / FECHAMENTO
   * =========================================================
   *
   * Quando a página é recarregada:
   *
   * pagehide -> grava horário
   * nova página -> verifica horário
   *
   * Se voltar em menos de 5 minutos:
   * mantém login.
   *
   * Se voltar depois de 5 minutos:
   * desloga.
   */

  useEffect(() => {
    function handlePageHide() {
      if (user) {
        localStorage.setItem(
          LAST_CLOSE_KEY,
          String(Date.now())
        );
      }
    }

    window.addEventListener(
      "pagehide",
      handlePageHide
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        handlePageHide
      );
    };
  }, [user]);

  /*
   * =========================================================
   * EXPIRAÇÃO AUTOMÁTICA
   * =========================================================
   *
   * Se a aplicação ficar aberta e sem atividade por
   * mais de 5 minutos, também podemos deslogar.
   */

  useEffect(() => {
    if (!user) {
      return;
    }

    const timeout = setTimeout(() => {
      console.log(
        "Sessão expirada."
      );

      clearSession();
      setUser(null);

      navigate("/login", {
        replace: true,
      });
    }, SESSION_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [user]);

  /*
   * =========================================================
   * CONTEXT
   * =========================================================
   */

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

/*
 * =========================================================
 * HOOK
 * =========================================================
 */

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth deve ser usado dentro de <AuthProvider>"
    );
  }

  return ctx;
}