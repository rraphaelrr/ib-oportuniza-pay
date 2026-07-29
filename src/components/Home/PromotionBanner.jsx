import React from "react";
import "./PromotionBanner.css";

function PromotionBanner({
  title,
  description,
  buttonText,
  onClick,
  image,
}) {
  return (
    <div className="promotion-banner">

      <div className="promotion-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

        {buttonText && (
          <button
            onClick={onClick}
          >
            {buttonText}
          </button>
        )}

      </div>


      {image && (
        <div className="promotion-image">
          <img
            src={image}
            alt={title}
          />
        </div>
      )}

    </div>
  );
}

export default PromotionBanner;