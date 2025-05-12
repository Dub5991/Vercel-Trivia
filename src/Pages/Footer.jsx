import { Container } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <Container className="text-center">
        <p>&copy; {currentYear} Trivia Time. All rights reserved.</p>
        <p>
          Built with ❤️ by <a href="https://github.com/Dub5991" className="text-info">Dustin</a>
        </p>
        <p>
          Questions sourced from the <a href="https://opentdb.com/" className="text-info">Open Trivia Database</a>.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;