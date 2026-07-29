// src/components/home/QuickActions.jsx

import React from "react";
import { FaPix } from "react-icons/fa6";
import {
  MdOutlineSwapHoriz,
  MdOutlineRequestQuote,
} from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";

import "./QuickActions.css";

export default function QuickActions({
  onPix,
  onTransfer,
  onReceive,
  onAnticipation,
}) {
  const actions = [
    {
      label: "Pix",
      icon: <FaPix />,
      action: onPix,
    },
    {
      label: "Transferir",
      icon: <MdOutlineSwapHoriz />,
      action: onTransfer,
    },
    {
      label: "Cobrar",
      icon: <MdOutlineRequestQuote />,
      action: onReceive,
    },
    {
      label: "Antecipar",
      icon: <BsCurrencyDollar />,
      action: onAnticipation,
    },
  ];

  return (
    <div className="quick-actions">
      {actions.map((item) => (
        <button
          key={item.label}
          className="quick-action"
          onClick={item.action}
        >
          <div className="quick-action-icon">
            {item.icon}
          </div>

          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}