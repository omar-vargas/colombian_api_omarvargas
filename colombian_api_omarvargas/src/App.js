import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Tabs from './Tab';
import AeropuertosTab from './Aeropuertos';
import AtraccionesTab from './Atracciones';
import PresidentesTab from './Presidentes';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('aeropuertos');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'aeropuertos':
        return <AeropuertosTab />;
      case 'atracciones':
        return <AtraccionesTab />;
      case 'presidentes':
        return <PresidentesTab />;
      default:
        return <AeropuertosTab />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/colombia_dash"
          element={
            <div className="app">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {renderActiveTab()}
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/colombia_dash" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
