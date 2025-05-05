import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const App = () => {
  const [trivia, setTrivia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0); // State for score
  const [timeLeft, setTimeLeft] = useState(30); // State for timer

  // Fetch random trivia questions
  const fetchTrivia = async () => {
    setLoading(true);
    setScore(0); // Reset score when refreshing questions
    setTimeLeft(30); // Reset timer when refreshing questions
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=6&type=multiple');
      const triviaWithAnswers = response.data.results.map((question) => ({
        ...question,
        showAnswer: false, // Add a field to track answer visibility
        userAnswer: null, // Add a field to track user's selected answer
      }));
      setTrivia(triviaWithAnswers);
    } catch (error) {
      console.error('Error fetching trivia:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrivia();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Reset trivia when time runs out
      fetchTrivia();
    }
  }, [timeLeft]);

  // Toggle the visibility of the answer and update score
  const toggleAnswer = (index) => {
    setTrivia((prevTrivia) =>
      prevTrivia.map((question, i) => {
        if (i === index) {
          if (!question.showAnswer && question.correct_answer === question.userAnswer) {
            setScore((prevScore) => prevScore + 1); // Increment score if the answer is correct
          }
          return { ...question, showAnswer: !question.showAnswer };
        }
        return question;
      })
    );
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Trivia Time - Test Your Knowledge!</h1>
      <div className="text-center mb-4">
        <h4>Score: {score}</h4>
        <h4>Time Left: {timeLeft}s</h4>
      </div>
      <div className="d-flex justify-content-center mb-4">
        <Button variant="success" onClick={fetchTrivia}>
          Refresh Questions
        </Button>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="grow" role="status" />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <Row className="g-4">
          {trivia.map((question, index) => (
            <Col key={index} lg={6} className="d-flex">
              <Card className="flex-fill shadow-sm">
                <Card.Header className="bg-primary text-white">
                  Question #{index + 1}
                </Card.Header>
                <Card.Body>
                  <Card.Text dangerouslySetInnerHTML={{ __html: question.question }} />
                  <Card.Footer className="text-muted">
                    Category: {question.category}
                  </Card.Footer>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      variant={question.showAnswer ? "danger" : "info"}
                      onClick={() => toggleAnswer(index)}
                    >
                      {question.showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </Button>
                    {question.showAnswer && (
                      <div>
                        <strong>Answer:</strong> {question.correct_answer}
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default App;