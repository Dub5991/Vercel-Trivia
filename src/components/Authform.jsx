import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully!");
        navigate("/about"); // Redirect to About page after login
      } else {
        // Signup logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          points: 0, // Initialize points to 0
        });

        console.log("User registered successfully!");
        setSuccess("Account created successfully! Please log in.");
        setIsLogin(true); // Switch to login mode
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
      setError(null); // Clear any previous error
    } catch (err) {
      setError(err.message);
      setSuccess(null); // Clear any previous success message
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column bg-light">
      <Row className="flex-grow-1">
        {/* Hero Section */}
        <Col lg={6} className="bg-dark text-white d-flex flex-column justify-content-center align-items-center p-4">
          <h1 className="display-4 fw-bold mb-3">Welcome to Trivia Time</h1>
          <p className="lead mb-4">
            Your one-stop solution for fun and challenging trivia!
          </p>
          <img
            src="../Trivia.png"
            className="rounded shadow"
            style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }}
            alt="Trivia Time"
          />
        </Col>

        <Col lg={6} className="d-flex flex-column justify-content-center align-items-center p-4">
          <Card className="shadow w-100" style={{ maxWidth: "400px" }}>
            <Card.Body>
              <h2 className="text-center fw-bold mb-4">
                {isLogin ? "Login to Your Account" : "Create a New Account"}
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleAuth}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </Form>
              {isLogin && (
                <p className="text-center text-muted mt-3">
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </span>
                </p>
              )}
              <p className="text-center text-muted mt-3">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsLogin(false)}
                    >
                      Sign up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsLogin(true)}
                    >
                      Login
                    </span>
                  </>
                )}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;