// src/components/Card.jsx
import React from "react";

export default function Card({ children, title, className = "" }) {
  return (
    <div className={`swms-card ${className}`}>
      {title && <div className="swms-card-header">{title}</div>}
      <div className="swms-card-body">{children}</div>
    </div>
  );
}
