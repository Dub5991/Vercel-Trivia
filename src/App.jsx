import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Scoreboard from "./Pages/Scoreboard";
import About from "./Pages/About";
import AuthForm from "./components/AuthForm"; // Handles login and signup
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthForm />} />

        {/* Protected Routes */}
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scoreboard"
          element={
            <ProtectedRoute>
              <Scoreboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<AuthForm />} />
      </Routes>
    </Router>
  );
};

export default App;