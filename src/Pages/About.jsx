import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AppNavbar from "../components/Navbar";
import Footer from "./Footer";
import "../styles/About.css"; // Import custom CSS for animations and styling

const About = () => {
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
        <Row className="mb-5">
          <Col md={6} className="about-card">
            <h2 className="about-heading">Meet the Team</h2>
            <p>
              A squad of developers and trivia enthusiasts on a mission to deliver the ultimate gaming experience.
            </p>
          </Col>
          <Col md={6} className="about-card">
            <h2 className="about-heading">Contact Us</h2>
            <p>
              Got feedback? Reach out me{" "}
              <a href="mailto:Snellingsd@icloud.com" className="about-link">
                 :)
              </a>.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="about-heading text-center">Gallery</h2>
            <div className="gallery-container">
              <div className="gallery-item">Image 1</div>
              <div className="gallery-item">Image 2</div>
              <div className="gallery-item">Image 3</div>
            </div>
          </Col>
        </Row>
        <Row className="text-center mt-5">
          <Col>
            <Button variant="primary" className="about-button">
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