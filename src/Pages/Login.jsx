import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { auth } from "../utils/firebaseConfig";
import './About.css';

const Login = () => {
  const user = auth.currentUser;

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <AuthForm />
    </div>
  );
};

export default Login;