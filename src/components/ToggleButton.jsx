import React from 'react';
import './ToggleButton.css';

const ToggleButton = ({ enabledImage, disabledImage, text, onClick, isOn }) => {
  return (
    <button 
      onClick={onClick} 
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
