import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={`dashboard-content ${
          collapsed
            ? "dashboard-content-collapsed"
            : ""
        }`}
      >
        <Topbar
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="dashboard-main">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}