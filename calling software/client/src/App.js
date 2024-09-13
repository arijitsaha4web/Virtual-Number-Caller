import React, { useState } from 'react';
import Dialer from './Dialer';
import CallScreen from './CallScreen';
import { Twilio } from '@twilio/voice-sdk';

import './Style.css';


const App = () => {
  const [callActive, setCallActive] = useState(false);
  const [device, setDevice] = useState(null);

  const handleCall = (phoneNumber) => {
    if (!device) {
      const token = 'YOUR_TWILIO_ACCESS_TOKEN';
      const newDevice = new Device(token);
      newDevice.on('ready', () => {
        console.log('Twilio device is ready');
      });
      setDevice(newDevice);
    }

    device.connect({ To: phoneNumber });
    setCallActive(true);
  };

  const handleHangUp = () => {
    device.disconnectAll();
    setCallActive(false);
  };

  return (
    <div className="app">
      {!callActive ? (
        <Dialer onCall={handleCall} />
      ) : (
        <CallScreen onHangUp={handleHangUp} />
      )}
    </div>
  );
};

export default App;
