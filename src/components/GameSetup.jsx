import { Card, Form, Button, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";

const GameSetup = ({ categories, onStartGame }) => {
  const [username, setUsername] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartGame = async () => {
    if (!username || username.length !== 3 || !/^[A-Za-z]+$/.test(username)) {
      setError("Please enter exactly 3 alphabetic initials (e.g., ABC).");
      return;
    }
    if (!gameMode) {
      setError("Please select a game mode.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);
    try {
      onStartGame({ username: username.toUpperCase(), gameMode, category });
      setError("");
    } catch (err) {
      setError("Failed to start the game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <h4 className="text-center mb-4">Welcome to Trivia!</h4>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Username (3 initials)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your initials (e.g., ABC)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toUpperCase().slice(0, 3))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Game Mode</Form.Label>
                  <Form.Select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                    <option value="">Select a game mode</option>
                    <option value="Timed Mode">Timed Mode</option>
                    <option value="Endless Mode">Endless Mode</option>
                    <option value="Challenge Mode">Challenge Mode</option>
                    <option value="Practice Mode">Practice Mode</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select a category</option>
                    {(categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={handleStartGame}
                    disabled={loading || !username || !gameMode || !category || !!error}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Starting...
                      </>
                    ) : (
                      "Start Game"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

GameSetup.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStartGame: PropTypes.func.isRequired,
};

export default GameSetup;