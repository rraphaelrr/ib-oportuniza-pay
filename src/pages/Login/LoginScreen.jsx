import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useDarkMode from "../../hooks/useDarkMode";
import "./LoginScreen.css";
import logo from "../../assets/privateAssets/logo.png";

// ─── Constantes ───────────────────────────────────────────────────────────────

const STEP = {
  START: "start",
  SAVED: "saved",
  TYPE: "type",
  INPUT: "input",
  PIN: "pin",
};

const TYPES = [
  {
    key: "cpf",
    label: "CPF",
    icon: "id-card",
    placeholder: "000.000.000-00",
    inputMode: "numeric",
  },
  {
    key: "email",
    label: "E-mail",
    icon: "mail",
    placeholder: "voce@email.com",
    inputMode: "email",
  },
  {
    key: "telefone",
    label: "Telefone",
    icon: "phone",
    placeholder: "(11) 99999-9999",
    inputMode: "numeric",
  },
  {
    key: "cnpj",
    label: "CNPJ",
    icon: "briefcase",
    placeholder: "00.000.000/0000-00",
    inputMode: "numeric",
  },
];

const EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "yahoo.com",
  "live.com",
  "bol.com.br",
  "uol.com.br",
  "terra.com.br",
];

const SAVED_USER_KEY = "@op_pay_saved_user";

// ─── Helpers de formatação ────────────────────────────────────────────────────

function formatCPF(v) {
  return v
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function formatPhone(v) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2")
    .slice(0, 15);
}

function formatCNPJ(v) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

function maskCPF(cpf) {
  return cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, "•••.$2.$3-••");
}

// ─── Ícones (SVG inline, sem dependência externa) ────────────────────────────

function Icon({ name, size = 22, color = "currentColor" }) {
  const paths = {
    "id-card": (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="12" r="2" />
        <path d="M13 10h5M13 14h5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M6 3h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </>
    ),
    "chevron-down": <path d="M6 9l6 6 6-6" />,
    "chevron-up": <path d="M18 15l-6-6-6 6" />,
    backspace: <path d="M9 4h11a1 1 0 011 1v14a1 1 0 01-1 1H9l-6-8 6-8z" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || null}
    </svg>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <div className="op-theme-toggle">
      <Icon
        name="sun"
        size={16}
        color={darkMode ? "rgba(255,255,255,0.35)" : "#003399"}
      />
      <button
        type="button"
        className={`op-switch ${darkMode ? "op-switch--on" : ""}`}
        role="switch"
        aria-checked={darkMode}
        aria-label="Alternar tema escuro"
        onClick={() => onToggle(!darkMode)}
      >
        <span className="op-switch-thumb" />
      </button>
      <Icon
        name="moon"
        size={16}
        color={darkMode ? "#003399" : "rgba(255,255,255,0.35)"}
      />
    </div>
  );
}

function ProgressDots({ step }) {
  const steps = [STEP.TYPE, STEP.INPUT, STEP.PIN];
  const idx = steps.indexOf(step);
  return (
    <div className="op-progress-row">
      {steps.map((s, i) => (
        <span
          key={s}
          className={`op-progress-dot ${i === idx ? "op-progress-dot--active" : ""}`}
        />
      ))}
    </div>
  );
}

function TypeCard({ item, selected, onPress }) {
  return (
    <button
      type="button"
      className={`op-type-card ${selected ? "op-type-card--selected" : ""}`}
      onClick={() => onPress(item.key)}
    >
      <Icon
        name={item.icon}
        size={26}
        color={selected ? "#FF6B00" : undefined}
      />
      <span className="op-type-label">{item.label}</span>
    </button>
  );
}

function PinDots({ length, filled }) {
  return (
    <div className="op-pin-dots">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className={`op-pin-dot ${i < filled ? "op-pin-dot--filled" : ""}`}
        />
      ))}
    </div>
  );
}

function Keypad({ onPress }) {
  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["blank", "0", "del"],
  ];
  return (
    <div className="op-keyboard">
      {rows.map((row, ri) => (
        <div className="op-kb-row" key={ri}>
          {row.map((k) => {
            if (k === "blank")
              return <div className="op-key op-key--blank" key={k} />;
            return (
              <button
                type="button"
                key={k}
                className={`op-key ${k === "del" ? "op-key--special" : ""}`}
                onClick={() => onPress(k)}
              >
                {k === "del" ? <Icon name="backspace" size={20} /> : k}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  const redirectTo = location.state?.from?.pathname || "/home";

  const [step, setStep] = useState(STEP.START);
  const [savedUser, setSavedUser] = useState(null);
  const [tipo, setTipo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [pin, setPin] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef(null);

  // Monta com transição de entrada do card (equivalente ao withDelay/withSpring)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    try {
      const raw = localStorage.getItem(SAVED_USER_KEY);
      if (raw) setSavedUser(JSON.parse(raw));
    } catch (_) {}
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step === STEP.INPUT && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const currentType = TYPES.find((t) => t.key === tipo);
  const inputValid = usuario.trim().length >= 3;
  const pinComplete = pin.length === 6;
  const userName = savedUser?.nome || "Usuário";
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  function goToTypeSelect() {
    setPin("");
    setUsuario("");
    setTipo("");
    setEmailSuggestions([]);
    setError("");
    setStep(STEP.TYPE);
  }

  function selectType(key) {
    setTipo(key);
    setUsuario("");
    setEmailSuggestions([]);
    setStep(STEP.INPUT);
  }

  function goToPin() {
    if (!inputValid) return;
    setPin("");
    setError("");
    setStep(STEP.PIN);
  }

  function toggleKeyboard() {
    setKeyboardOpen((v) => !v);
  }

  function pressKey(k) {
    setError("");
    if (k === "del") {
      setPin((p) => p.slice(0, -1));
    } else if (pin.length < 6) {
      setPin((p) => p + k);
    }
  }

  function handleUserChange(e) {
    const text = e.target.value;
    let formatted = text;
    if (tipo === "cpf") formatted = formatCPF(text);
    else if (tipo === "cnpj") formatted = formatCNPJ(text);
    else if (tipo === "telefone") formatted = formatPhone(text);
    setUsuario(formatted);

    if (tipo === "email" && text.includes("@")) {
      const user = text.split("@")[0];
      setEmailSuggestions(EMAIL_DOMAINS.map((d) => `${user}@${d}`));
    } else {
      setEmailSuggestions([]);
    }
  }

  async function handleLogin() {
    if (!pinComplete || loading) return;
    setLoading(true);
    setError("");
    try {
      const user = await login({ tipo, usuario, senha: pin });
      localStorage.setItem(
        SAVED_USER_KEY,
        JSON.stringify({ nome: user.nome, tipo, usuario }),
      );
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setError(
        "Não foi possível entrar. Verifique seus dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickLogin() {
    if (!savedUser) return;
    setLoading(true);
    try {
      const user = await login({
        tipo: savedUser.tipo,
        usuario: savedUser.usuario,
        senha: "saved",
      });
      navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  function forgetSavedUser() {
    localStorage.removeItem(SAVED_USER_KEY);
    setSavedUser(null);
    goToTypeSelect();
  }

  return (
    <div className={`op-root ${darkMode ? "op-root--dark" : ""}`}>
      <div className="op-theme-toggle-wrapper">
        <DarkModeToggle darkMode={darkMode} onToggle={setDarkMode} />
      </div>

      {/* <div
        className={`op-logo-area ${step !== STEP.START ? "op-logo-area--compact" : ""}`}
      >
        <div className="op-logo-icon">
          <img src={logo} alt="Logo" className="op-logo-icon" width={200} />
        </div>
      </div> */}

      <div
        className={`op-card ${darkMode ? "op-card--dark" : ""} ${mounted ? "op-card--in" : ""}`}
      >
        <div className="op-card-scroll">
          {/* ════ SAVED USER ════ */}
          {step === STEP.SAVED && savedUser && (
            <div className="op-saved-panel">
              <div className="op-saved-avatar">{initials}</div>
              <div className="op-saved-name">{userName}</div>
              <div className="op-saved-info">
                {savedUser.tipo === "cpf"
                  ? maskCPF(savedUser.usuario)
                  : savedUser.usuario}
              </div>

              <button
                className="op-btn-primary op-mt-24"
                onClick={() => setStep(STEP.START)}
              >
                Entrar com senha
              </button>

              <button
                className="op-link-muted op-mt-18"
                onClick={forgetSavedUser}
              >
                Usar outra conta
              </button>
            </div>
          )}

          {/* ════ START ════ */}
          {step === STEP.START && (
            <div className="op-step-center">
              {/* <p className="op-welcome-text">Bem-vindo ao Oportuniza Pay</p> */}
              <img src={logo} alt="Logo" className="op-logo-icon" width={200} />
              <button
                className="op-btn-primary"
                onClick={() =>
                  savedUser ? setStep(STEP.SAVED) : setStep(STEP.TYPE)
                }
              >
                Entrar
              </button>

              <button
                className="op-btn-outline op-mt-12"
                onClick={() => navigate("/cadastro")}
              >
                Criar conta
              </button>
            </div>
          )}

          {/* ════ TYPE SELECT ════ */}
          {step === STEP.TYPE && (
            <div>
              <ProgressDots step={step} />
              <p className="op-step-label">Como deseja entrar?</p>
              <div className="op-type-grid">
                {TYPES.map((item) => (
                  <TypeCard
                    key={item.key}
                    item={item}
                    selected={tipo === item.key}
                    onPress={selectType}
                  />
                ))}
              </div>
              <button
                className="op-back-link"
                onClick={() => setStep(STEP.START)}
              >
                ← Voltar ao início
              </button>
            </div>
          )}

          {/* ════ INPUT ════ */}
          {step === STEP.INPUT && currentType && (
            <div>
              <ProgressDots step={step} />
              <p className="op-step-label">{currentType.label}</p>

              <input
                ref={inputRef}
                className="op-input"
                value={usuario}
                onChange={handleUserChange}
                placeholder={currentType.placeholder}
                inputMode={currentType.inputMode}
                onKeyDown={(e) => e.key === "Enter" && inputValid && goToPin()}
              />

              {emailSuggestions.length > 0 && (
                <div className="op-suggest-box">
                  {emailSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="op-suggest-item"
                      onClick={() => {
                        setUsuario(s);
                        setEmailSuggestions([]);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <button
                className="op-btn-primary"
                onClick={goToPin}
                disabled={!inputValid}
              >
                Continuar
              </button>

              <button
                className="op-back-link"
                onClick={() => setStep(STEP.TYPE)}
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* ════ PIN ════ */}
          {step === STEP.PIN && (
            <div className="op-pin-step">
              <ProgressDots step={step} />
              <p className="op-step-label">Senha de 6 dígitos</p>

              <PinDots length={6} filled={pin.length} />

              {error && <p className="op-error-text">{error}</p>}

              <button
                className={`op-pin-toggle ${keyboardOpen ? "op-pin-toggle--open" : ""}`}
                onClick={toggleKeyboard}
              >
                <Icon
                  name="lock"
                  size={20}
                  color={keyboardOpen ? "#003399" : undefined}
                />
                <span>
                  {keyboardOpen
                    ? "Fechar teclado"
                    : "Toque para digitar a senha"}
                </span>
                <Icon
                  name={keyboardOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                />
              </button>

              {keyboardOpen && <Keypad onPress={pressKey} />}

              <button
                className="op-btn-primary op-mt-16"
                onClick={handleLogin}
                disabled={!pinComplete || loading}
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>

              <button
                className="op-back-link"
                onClick={() => setStep(STEP.INPUT)}
              >
                ← Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
