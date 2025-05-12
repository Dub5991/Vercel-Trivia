import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { auth } from "../utils/firebaseConfig";

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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock authentication logic (replace with your actual auth logic)
    if (username === "user" && password === "password") {
      localStorage.setItem("user", username); // Store user in localStorage
      navigate("/home"); // Redirect to Home page
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Login</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;