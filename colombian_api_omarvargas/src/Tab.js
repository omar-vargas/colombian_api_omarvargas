import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <nav>
      <button 
        className={activeTab === 'presidentes' ? 'active' : ''} 
        onClick={() => setActiveTab('presidentes')}
      >
        Presidentes
      </button>
      <button 
        className={activeTab === 'atracciones' ? 'active' : ''} 
        onClick={() => setActiveTab('atracciones')}
      >
        Atracciones Turísticas
      </button>
      <button 
        className={activeTab === 'aeropuertos' ? 'active' : ''} 
        onClick={() => setActiveTab('aeropuertos')}
      >
        Aeropuertos
      </button>
    </nav>
  );
};

export default Tabs;
