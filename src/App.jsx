import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Scoreboard from "./Pages/Scoreboard";
import About from "./Pages/About"; // Import the About page
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} /> {/* About page is now public */}

        {/* Protected Routes */}
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
        <Route path="/" element={<About />} /> {/* Redirect to About by default */}
      </Routes>
    </Router>
  );
};

export default App;