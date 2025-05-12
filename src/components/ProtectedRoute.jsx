import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { auth } from "../utils/firebaseConfig"; // Firebase authentication

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; // Check if the user is authenticated

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;