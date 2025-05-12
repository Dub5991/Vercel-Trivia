<<<<<<< HEAD
import React from "react";
=======
>>>>>>> 9024413857412afe176ccbf5f806eb68ca937cd6
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
<<<<<<< HEAD
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} /> {/* About page is now public */}

        {/* Protected Routes */}
        <Route
          path="/home"
=======
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
>>>>>>> 9024413857412afe176ccbf5f806eb68ca937cd6
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
<<<<<<< HEAD

        {/* Default Route */}
        <Route path="/" element={<About />} /> {/* Redirect to About by default */}
=======
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
>>>>>>> 9024413857412afe176ccbf5f806eb68ca937cd6
      </Routes>
    </Router>
  );
};

export default App;