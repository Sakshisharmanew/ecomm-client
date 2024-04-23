import React from "react";
import "./star.css";
const Star = ({ filled, onClick }) => {
  const starClassName = filled ? "stars filledd" : "stars";

  return (
    <span className={starClassName} onClick={onClick}>
      &#9733;
    </span>
  );
};

export default Star;
