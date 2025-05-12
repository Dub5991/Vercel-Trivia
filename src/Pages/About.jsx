// Import the functions you need from the SDKs you need
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "./Footer";

const About = () => {
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    const user = localStorage.getItem("user"); // Check if user is authenticated
    if (user) {
      navigate("/home"); // Navigate to Home if authenticated
    } else {
      navigate("/login"); // Navigate to Login if not authenticated
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="about-container">
        <Row className="text-center mb-5">
          <Col>
            <h1 className="about-title">Welcome to Trivia Time</h1>
            <p className="about-subtitle">
              Where knowledge meets competition. Dive into the ultimate trivia experience and become a legend.
            </p>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col md={6} className="about-card">
            <h2 className="about-heading">Our Mission</h2>
            <p>
              To create a platform where learning meets gaming. Challenge yourself, climb the leaderboard, and become a trivia master.
            </p>
          </Col>
          <Col md={6} className="about-card">
            <h2 className="about-heading">Features</h2>
            <ul>
              <li>🔥 Diverse trivia categories</li>
              <li>🎮 Gamer-friendly interface</li>
              <li>🏆 Real-time leaderboards</li>
              <li>📅 Regular updates</li>
            </ul>
          </Col>
        </Row>
        <Row className="text-center mt-5">
          <Col>
            <Button
              variant="primary"
              className="about-button"
              onClick={handleStartPlaying}
            >
              Start Playing Now
            </Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default About;