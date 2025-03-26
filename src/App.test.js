const { render, screen } = require('@testing-library/react');
const App = require('./App').default;
import { BrowserRouter as Router } from 'react-router-dom';
// const { BrowserRouter: Router } = require('react-router-dom');

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText('Weather App')).toBeInTheDocument();
  });
});