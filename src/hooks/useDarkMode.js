import { useEffect, useState } from "react";

const STORAGE_KEY = "@op_pay_dark_mode";

export default function useDarkMode() {
  const [darkMode, setDarkModeState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw !== null ? JSON.parse(raw) : false;
    } catch (_) {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("op-dark", darkMode);
  }, [darkMode]);

  function setDarkMode(value) {
    setDarkModeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (_) {}
  }

  return { darkMode, setDarkMode };
}
