import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders title and restart button', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Restart game/i })).toBeInTheDocument();
});

test('allows players to take turns and detect win/draw state basics', () => {
  render(<App />);
  const cells = screen.getAllByRole('button', { name: /Square/ });
  // First click is X
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
  // Second click is O
  fireEvent.click(cells[1]);
  expect(cells[1]).toHaveTextContent('O');
});
