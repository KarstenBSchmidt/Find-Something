import React, { useState } from 'react';
import './ToggleButton.css';

const ToggleButton = ({ enabledImage, disabledImage, text, onClick }) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = (event) => {
    setIsOn(!isOn);
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`toggle-button ${isOn ? 'on' : 'off'}`}
    >
      <img 
        src={isOn ? enabledImage : disabledImage} 
        alt="button state" 
        className="toggle-image"
      />
      <p className="toggle-text">{text}</p>
    </button>
  );
};

export default ToggleButton;
