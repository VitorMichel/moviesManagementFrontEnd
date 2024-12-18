import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MoviesList from './components/MoviesList';
import ActorsList from './components/ActorsList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/actors" element={<ActorsList />} />
      </Routes>
    </Router>
  );
};

export default App;
