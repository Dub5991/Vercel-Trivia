// Test file for the Scoreboard component

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import Scoreboard from '../Pages/Scoreboard';

describe('Scoreboard Component', () => {
  const mockScoreboard = [
    {
      username: 'John Doe',
      score: 10,
      remainingTime: 50,
      gameMode: 'Timed Mode',
      date: '2025-05-06 10:00 AM',
    },
    {
      username: 'Jane Smith',
      score: 15,
      remainingTime: 30,
      gameMode: 'Endless Mode',
      date: '2025-05-06 11:00 AM',
    },
  ];

  it('renders the table headers correctly', () => {
    render(<Scoreboard scoreboard={mockScoreboard} />);

    // Check if the table headers are rendered
    expect(screen.getByText('Scoreboard')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Remaining Time')).toBeInTheDocument();
    expect(screen.getByText('Game Mode')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('displays the correct scoreboard data', () => {
    render(<Scoreboard scoreboard={mockScoreboard} />);

    // Check if the data for the first user is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('50s')).toBeInTheDocument();
    expect(screen.getByText('Timed Mode')).toBeInTheDocument();
    expect(screen.getByText('2025-05-06 10:00 AM')).toBeInTheDocument();

    // Check if the data for the second user is displayed
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('30s')).toBeInTheDocument();
    expect(screen.getByText('Endless Mode')).toBeInTheDocument();
    expect(screen.getByText('2025-05-06 11:00 AM')).toBeInTheDocument();
  });

  it('renders correctly with an empty scoreboard', () => {
    render(<Scoreboard scoreboard={[]} />);

    // Check if the table headers are still rendered
    expect(screen.getByText('Scoreboard')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Remaining Time')).toBeInTheDocument();
    expect(screen.getByText('Game Mode')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();

    // Check if the "No scores available" message is displayed
    expect(screen.getByText('No scores available')).toBeInTheDocument();
  });
});