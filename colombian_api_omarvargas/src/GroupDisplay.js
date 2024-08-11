import React from 'react';

const GroupDisplay = ({ title, children }) => {
  return (
    <div className="group-display">
      <h4 className="group-title">{title}</h4>
      <div className="group-content">
        {children}
      </div>
    </div>
  );
};

export default GroupDisplay;
