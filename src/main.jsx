import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./layout/global.css";
import "dayjs/locale/pt-br";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <App />
    </LocalizationProvider>
  </React.StrictMode>,
);
