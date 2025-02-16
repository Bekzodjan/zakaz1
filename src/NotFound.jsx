// src/pages/NotFoundPage.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { alert } from "./DoExpence";
// import "./NotFoundPage.css";  // Optional: For custom styling

const NotFoundPage = () => {
  useEffect(() => {
    alert("PAGE NOT FOUND", false);
  }, []);
  return (
    <div className="not-found">
      <ToastContainer />

      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Oops! The page you're looking for does not exist.
      </p>
      <Link to="/" className="not-found-link">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
