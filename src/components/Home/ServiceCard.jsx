import React from "react";
import "./ServiceCard.css";

function ServiceCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      className="service-card"
      onClick={onClick}
    >
      <div className="service-icon">
        {icon}
      </div>

      <div className="service-content">
        <strong>
          {title}
        </strong>

        {description && (
          <span>
            {description}
          </span>
        )}
      </div>
    </button>
  );
}

export default ServiceCard;