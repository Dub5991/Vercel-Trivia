import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';

const App = () => {
  const [trivia, setTrivia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

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
    setScore(0);
    setTimeLeft(30);
    setCurrentQuestionIndex(0);
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=6&type=multiple&category=${category}`
      );
      const triviaWithAnswers = response.data.results.map((question) => ({
        ...question,
        answers: shuffleAnswers([
          ...question.incorrect_answers,
          question.correct_answer,
        ]),
      }));
      setTrivia(triviaWithAnswers);
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
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted]);

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer === trivia[currentQuestionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedAnswer(null);
    if (currentQuestionIndex < trivia.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameStarted(false); // End game when all questions are answered
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Trivia Time - Test Your Knowledge!</h1>
      {!gameStarted ? (
        <>
          <div className="text-center mb-4">
            <h4>Select a Category</h4>
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
            <Button
              variant="primary"
              onClick={() => {
                if (category) {
                  setGameStarted(true);
                  fetchTrivia();
                }
              }}
              disabled={!category}
            >
              Start Game
            </Button>
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
            <h4>Score: {score}</h4>
            <h4>Time Left: {timeLeft}s</h4>
          </div>
          <Row className="justify-content-center">
            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  Question #{currentQuestionIndex + 1}
                </Card.Header>
                <Card.Body>
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: trivia[currentQuestionIndex].question,
                    }}
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
                      />
                    ))}
                  </Form>
                  <Button
                    variant="success"
                    className="mt-3"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                  >
                    Submit Answer
                  </Button>
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