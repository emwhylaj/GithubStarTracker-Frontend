import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import RepositoryList from './Components/RepositoryList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<RepositoryList />} />
            <Route path="/repo-info" element={<RepositoryList showInfo={true} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;