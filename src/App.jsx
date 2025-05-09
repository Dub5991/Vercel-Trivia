import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, Alert, Table, ProgressBar } from 'react-bootstrap';
import axios from 'axios';

// Helper function to decode HTML entities
const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const App = () => {
  const [trivia, setTrivia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // Timer starts at 100 seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState(null); // Feedback for correct/incorrect answers
  const [answerColors, setAnswerColors] = useState({}); // Colors for answer validation
  const [isPaused, setIsPaused] = useState(false); // Pause state for the timer
  const [scoreboard, setScoreboard] = useState([]); // Scoreboard to track scores
  const [username, setUsername] = useState(''); // Username input
  const [gameMode, setGameMode] = useState(''); // Selected game mode

  // Fetch trivia categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api_category.php');
      setCategories(response.data.trivia_categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch trivia questions
  const fetchTrivia = async () => {
    setLoading(true);
    setFeedback(null);
    setAnswerColors({});
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=1000&type=multiple&category=${category}`
      );
      const triviaWithAnswers = response.data.results.map((question) => ({
        ...question,
        question: decodeHtml(question.question), // Decode question text
        answers: shuffleAnswers([
          ...question.incorrect_answers.map(decodeHtml), // Decode incorrect answers
          decodeHtml(question.correct_answer), // Decode correct answer
        ]),
      }));

      if (gameMode === 'Endless Mode') {
        // Replace trivia with new questions and reset index
        setTrivia(triviaWithAnswers);
        setCurrentQuestionIndex(0);
      } else {
        // Append new questions for other modes
        setTrivia((prevTrivia) => [...prevTrivia, ...triviaWithAnswers]);
      }
    } catch (error) {
      console.error('Error fetching trivia:', error);
    } finally {
      setLoading(false);
    }
  };

  // Shuffle answers for randomness
  const shuffleAnswers = (answers) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    fetchCategories();
    // Load scoreboard from localStorage
    const savedScores = JSON.parse(localStorage.getItem('scoreboard')) || [];
    setScoreboard(savedScores);
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameMode === 'Timed Mode') {
      endGame(); // End game when time runs out in Timed Mode
    }
  }, [timeLeft, gameStarted, isPaused, endGame, gameMode]);

  // Handle answer submission
  const handleSubmitAnswer = () => {
    const currentQuestion = trivia[currentQuestionIndex];
    const newAnswerColors = {};

    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore((prevScore) => prevScore + 1); // Add points for correct answer
      setTimeLeft((prevTime) => prevTime + 5); // Add 5 seconds to the timer
      setFeedback({ type: 'success', message: 'Correct! 5 seconds added to the timer!' });
      newAnswerColors[currentQuestion.correct_answer] = 'success'; // Highlight correct answer in green
    } else {
      setFeedback({
        type: 'danger',
        message: `Incorrect! The correct answer was: ${currentQuestion.correct_answer}.`,
      });
      newAnswerColors[selectedAnswer] = 'danger'; // Highlight incorrect answer in red
      newAnswerColors[currentQuestion.correct_answer] = 'success'; // Highlight correct answer in green
    }

    setAnswerColors(newAnswerColors);
    setIsPaused(true); // Pause the timer during the transition

    // Delay before moving to the next question
    setTimeout(() => {
      setFeedback(null);
      setAnswerColors({});
      setSelectedAnswer(null);
      setIsPaused(false); // Resume the timer after the transition
      if (currentQuestionIndex < trivia.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else if (gameMode === 'Endless Mode') {
        fetchTrivia(); // Fetch more questions in Endless Mode
      }
    }, 1000); // 1-second delay
  };

  // End game and save score to localStorage
  const endGame = () => {
    setGameStarted(false);
    const newScore = {
      username,
      score,
      gameMode,
      remainingTime: timeLeft, // Save remaining time to the scoreboard
      date: new Date().toLocaleString(),
    };
    const updatedScoreboard = [...scoreboard, newScore];
    setScoreboard(updatedScoreboard);
    localStorage.setItem('scoreboard', JSON.stringify(updatedScoreboard));
  };

  // Quit game and save current score
  const quitGame = () => {
    endGame(); // Call the endGame function to save the current score
  };

  // Start a new game
  const startNewGame = () => {
    setGameStarted(true);
    setScore(0); // Reset score
    setTimeLeft(100); // Reset timer to 100 seconds
    setCurrentQuestionIndex(0); // Reset question index
    fetchTrivia(); // Fetch new trivia questions
  };

  return (
    <Container className="my-5" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px' }}>
      <h1 className="text-center mb-4" style={{ color: '#333333', fontWeight: 'bold' }}>
        Trivia Time 🎉
      </h1>
      {!gameStarted ? (
        <>
          <Card className="p-4 shadow-lg" style={{ backgroundColor: '#F8F9FA', color: '#333333' }}>
            <Card.Body>
              <h4 className="text-center mb-4">Enter Your Username</h4>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-3"
              />
              <h4 className="text-center mb-4">Select a Game Mode</h4>
              <Form.Select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                className="mb-3"
              >
                <option value="">-- Select a Game Mode --</option>
                <option value="Timed Mode">Timed Mode</option>
                <option value="Endless Mode">Endless Mode</option>
              </Form.Select>
              <h4 className="text-center mb-4">Select a Category</h4>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mb-3"
              >
                <option value="">-- Select a Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startNewGame}
                  disabled={!username || !gameMode || !category}
                >
                  Start Game
                </Button>
              </div>
            </Card.Body>
          </Card>
          <div className="mt-5">
            <h4 className="text-center" style={{ color: '#333333' }}>Scoreboard</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Remaining Time</th>
                  <th>Game Mode</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scoreboard.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.username}</td>
                    <td>{entry.score}</td>
                    <td>{entry.remainingTime}s</td>
                    <td>{entry.gameMode}</td>
                    <td>{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="grow" role="status" />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h4 style={{ color: '#333333' }}>Score: {score}</h4>
            <ProgressBar
              now={(timeLeft / 100) * 100}
              label={`${timeLeft}s`}
              variant="info"
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
              <Card className="shadow-lg" style={{ backgroundColor: '#F8F9FA', color: '#333333' }}>
                <Card.Header className="text-center" style={{ backgroundColor: '#007BFF', color: '#FFFFFF' }}>
                  <strong>Question #{currentQuestionIndex + 1}</strong>
                </Card.Header>
                <Card.Body>
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: trivia[currentQuestionIndex].question,
                    }}
                    className="fs-5"
                  />
                  <Form>
                    {trivia[currentQuestionIndex].answers.map((answer, index) => (
                      <Form.Check
                        key={index}
                        type="radio"
                        name="answer"
                        label={answer}
                        value={answer}
                        checked={selectedAnswer === answer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className={`mb-2 ${
                          answerColors[answer] === 'success'
                            ? 'text-success'
                            : answerColors[answer] === 'danger'
                            ? 'text-danger'
                            : ''
                        }`}
                        disabled={!!feedback} // Disable selection after submission
                      />
                    ))}
                  </Form>
                  <div className="text-center mt-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleSubmitAnswer}
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
      )}
    </Container>
  );
};

export default App;