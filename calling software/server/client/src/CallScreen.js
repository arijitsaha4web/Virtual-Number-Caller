import React from 'react';

const CallScreen = ({ onHangUp }) => {
  return (
    <div className="call-screen">
      <h2>Calling...</h2>
      <button onClick={onHangUp}>Hang Up</button>
    </div>
  );
};

export default CallScreen;
