import { Row, Col, Card, Form, Button, ProgressBar, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect } from "react";

const GameInterface = ({
  trivia = [],
  currentQuestionIndex = 0,
  selectedAnswer = "",
  setSelectedAnswer = () => {},
  handleSubmitAnswer = () => {},
  quitGame = () => {},
  feedback = null,
  answerColors = {},
  timeLeft = 0,
  setTimeLeft = () => {}, // Add setTimeLeft to update the timer
  score = 0,
  gameMode = "Timed Mode", // Add gameMode prop
}) => {
  let progressValue = 0;
  let progressLabel = "";

  // Calculate progress based on game mode
  if (gameMode === "Timed Mode") {
    progressValue = Math.max(0, (timeLeft / 60) * 100); // Time left as a percentage of 60 seconds
    progressLabel = `${timeLeft}s`;
  } else if (gameMode === "Endless Mode") {
    progressValue = Math.min(100, ((currentQuestionIndex + 1) / trivia.length) * 100); // Questions answered
    progressLabel = `${currentQuestionIndex + 1}/${trivia.length}`;
  } else if (gameMode === "Challenge Mode") {
    progressValue = Math.max(0, (timeLeft / 30) * 100); // Time left as a percentage of 30 seconds
    progressLabel = `${timeLeft}s`;
  } else {
    progressValue = 0;
    progressLabel = "N/A";
  }

  // Handle timer countdown for Timed Mode and Challenge Mode
  useEffect(() => {
    if ((gameMode === "Timed Mode" || gameMode === "Challenge Mode") && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on unmount
    } else if (timeLeft === 0 && (gameMode === "Timed Mode" || gameMode === "Challenge Mode")) {
      handleSubmitAnswer(""); // Auto-submit if time runs out
    }
  }, [timeLeft, gameMode, handleSubmitAnswer, setTimeLeft]);

  return (
    <>
      <div className="text-center mb-4">
        <h4 style={{ color: "#333333" }}>Score: {score}</h4>
        <ProgressBar
          now={progressValue}
          label={progressLabel}
          variant={progressValue > 50 ? "info" : progressValue > 20 ? "warning" : "danger"}
          className="mb-3"
        />
      </div>
      {feedback && (
        <Alert variant={feedback.type} className="text-center">
          {feedback.message}
        </Alert>
      )}
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Updated card with spinning-gradient class */}
          <Card className="shadow-lg spinning-gradient" style={{ backgroundColor: "#F8F9FA", color: "#333333" }}>
            <Card.Header className="text-center" style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}>
              <strong>Question #{currentQuestionIndex + 1}</strong>
            </Card.Header>
            <Card.Body>
              <Card.Text
                dangerouslySetInnerHTML={{
                  __html: trivia[currentQuestionIndex]?.question || "No question available",
                }}
                className="fs-5"
              />
              <Form>
                {(trivia[currentQuestionIndex]?.answers || []).map((answer, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    name="answer"
                    label={answer}
                    value={answer}
                    checked={selectedAnswer === answer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className={`mb-2 ${
                      answerColors[answer] === "success"
                        ? "text-success"
                        : answerColors[answer] === "danger"
                        ? "text-danger"
                        : ""
                    }`}
                    disabled={!!feedback}
                  />
                ))}
              </Form>
              <div className="text-center mt-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => handleSubmitAnswer(selectedAnswer)}
                  disabled={!selectedAnswer || feedback !== null}
                >
                  Submit Answer
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  className="ms-3"
                  onClick={quitGame}
                >
                  Quit Game
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

GameInterface.propTypes = {
  trivia: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  setSelectedAnswer: PropTypes.func.isRequired,
  handleSubmitAnswer: PropTypes.func.isRequired,
  quitGame: PropTypes.func.isRequired,
  feedback: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
  answerColors: PropTypes.object,
  timeLeft: PropTypes.number.isRequired,
  setTimeLeft: PropTypes.func.isRequired, // Add setTimeLeft prop validation
  score: PropTypes.number.isRequired,
  gameMode: PropTypes.string.isRequired, // Add gameMode prop validation
};

export default GameInterface;