import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import GameSetup from "../components/GameSetup";
import GameInterface from "../components/GameInterface";
import AppNavbar from "../components/Navbar";
import Footer from "./Footer";
import { saveGameResult } from "../utils/firestoreUtils";

const decodeHtmlEntities = (text) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [score, setScore] = useState(0);
  const [trivia, setTrivia] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [answerColors, setAnswerColors] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [username, setUsername] = useState("");
  const [gameMode, setGameMode] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://opentdb.com/api_category.php");
        setCategories(response.data.trivia_categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const startNewGame = async ({ username, gameMode, category }) => {
    setUsername(username);
    setGameMode(gameMode);
    setGameStarted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setFeedback(null);
    setAnswerColors({});
    setTimeLeft(gameMode === "Challenge Mode" ? 30 : 60);

    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=1000&category=${category}&type=multiple`
      );

      if (!response.data.results || response.data.results.length === 0) {
        alert("No questions available for the selected category. Please choose a different category.");
        return;
      }

      const formattedTrivia = response.data.results.map((item) => ({
        question: decodeHtmlEntities(item.question),
        answers: item.incorrect_answers
          .concat(item.correct_answer)
          .map(decodeHtmlEntities)
          .sort(() => Math.random() - 0.5),
        correct_answer: decodeHtmlEntities(item.correct_answer),
      }));
      setTrivia(formattedTrivia);
      setGameStarted(true);
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
      alert("An error occurred while fetching trivia questions. Please try again.");
    }
  };

  const endGame = () => {
    saveGameResult({
      username: username || "Guest",
      score,
      remainingTime: timeLeft || 0,
      gameMode: gameMode || "Default Mode",
    });
    setGameStarted(false);
  };

  return (
    <>
      <AppNavbar />
      <Container className="my-5">
        <h1 className="text-center mb-4">Trivia Time 🎉</h1>
        {!gameStarted ? (
          <GameSetup categories={categories} onStartGame={startNewGame} />
        ) : (
          <GameInterface
            trivia={trivia}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            handleSubmitAnswer={(answer) => {
              const correctAnswer = trivia[currentQuestionIndex].correct_answer;
              if (answer === correctAnswer) {
                setScore((prev) => prev + 1);
                setFeedback({ type: "success", message: "Correct!" });
                setAnswerColors({ [answer]: "success" });
                setTimeLeft((prevTime) => prevTime + 5);
              } else {
                setFeedback({ type: "danger", message: `Wrong! The correct answer was ${correctAnswer}.` });
                setAnswerColors({ [answer]: "danger", [correctAnswer]: "success" });
              }
              setTimeout(() => {
                if (currentQuestionIndex + 1 < trivia.length) {
                  setCurrentQuestionIndex((prev) => prev + 1);
                  setSelectedAnswer("");
                  setFeedback(null);
                  setAnswerColors({});
                } else {
                  endGame();
                }
              }, 2000);
            }}
            quitGame={endGame}
            feedback={feedback}
            answerColors={answerColors}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            score={score}
            gameMode={gameMode}
          />
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Home;