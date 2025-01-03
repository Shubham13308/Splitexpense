import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IntroPage from './Components/UI/IntroPage';
import DetailsPages from './Pages/DetailsPages';
import Group from './Components/Group/Group';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/details" element={<DetailsPages />} />
        <Route path="/group" element={<Group />} />
        
      </Routes>
    </Router>
  );
};

export default App;
