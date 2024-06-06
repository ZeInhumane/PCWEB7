import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import SignUpPage from './views/SignUpPage';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider, useTheme } from './ThemeContext';
import PrivateRoute from './components/PrivateRoute';
// import styles
import './styles.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <Routes>
        <Route path="/" element={<PrivateRoute component={HomePage} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
};

export default App;
