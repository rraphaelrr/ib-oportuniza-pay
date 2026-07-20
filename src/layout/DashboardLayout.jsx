import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div
        className={`dashboard-content ${
          collapsed ? "dashboard-content-collapsed" : ""
        }`}
      >
        <Topbar />

        <main className="dashboard-main">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
}