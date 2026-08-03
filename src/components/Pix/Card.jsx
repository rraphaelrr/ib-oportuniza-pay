import React from "react";

export default function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  className = "",
}) {

  return (
    <div className={`pix-card ${className}`}>

      {(title || Icon) && (
        <div className="pix-card-header">

          {Icon && (
            <div className="pix-card-icon">
              <Icon size={22}/>
            </div>
          )}

          <div>
            {title && (
              <h3>
                {title}
              </h3>
            )}

            {subtitle && (
              <p>
                {subtitle}
              </p>
            )}
          </div>

        </div>
      )}


      <div className="pix-card-content">
        {children}
      </div>


    </div>
  );
}