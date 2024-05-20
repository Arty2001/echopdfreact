import React from 'react';
import './RecordingIcon.css'; // Import the CSS file with the styles

function RecordingIcon() {
  return (
    <div className="recording-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle className="outer-circle" cx="12" cy="12" r="10" fill="transparent" stroke="blue" strokeWidth="2"/>
        <circle className="inner-circle" cx="12" cy="12" r="6" fill="blue"/>
      </svg>
    </div>
  );
}

export default RecordingIcon;