import { Table, Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { listenToScoreboard } from "../utils/firestoreUtils"; // Correctly import listenToScoreboard
import AppNavbar from "../components/Navbar";
import Footer from "../Pages/Footer";

const Scoreboard = () => {
  const [globalScoreboard, setGlobalScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToScoreboard((data) => {
      setGlobalScoreboard(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <AppNavbar />
      <Container className="my-5">
        <h1 className="text-center mb-4">Scoreboard</h1>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Score</th>
                <th>Game Mode</th>
                <th>Remaining Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {globalScoreboard.slice(0, 10).map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.score}</td>
                  <td>{entry.gameMode}</td>
                  <td>{entry.remainingTime}s</td>
                  <td>{new Date(entry.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Scoreboard;