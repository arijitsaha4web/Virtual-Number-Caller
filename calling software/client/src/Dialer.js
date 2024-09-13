import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import './dialer.css';

const Dialer = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');

  const handle50Calls = async () => {
    setIsCalling(true);
    setError('');
    try {
      const response = await fetch('/api/call/50-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error('Error making calls:', err);
      setError('Error making calls.');
    } finally {
      setIsCalling(false);
    }
  };

  const handleCall = async () => {
    if (phoneNumber) {
      setIsCalling(true);
      setError('');
      try {
        const response = await fetch('/api/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber })
        });
        const data = await response.json();
        console.log(data.message);
      } catch (err) {
        console.error('Error making call:', err);
        setError('Error making call.');
      } finally {
        setIsCalling(false);
      }
    } else {
      setError('Please enter a phone number.');
    }
  };

  const handleRecord = () => {
    if (isCalling) {
      setIsRecording(!isRecording);
      setError('');
    } else {
      setError('You must be on a call to start recording.');
    }
  };

  return (
    <Container className="dialer-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Virtual Number Caller</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <div className="mt-4 text-center">
                <Button
                  variant="primary"
                  className="mx-2"
                  onClick={handle50Calls}
                  disabled={isCalling}
                >
                  {isCalling ? 'Calling...' : 'Call 50 Numbers'}
                </Button>
                <Button
                  variant="primary"
                  className="mx-2"
                  onClick={handleCall}
                  disabled={isCalling}
                >
                  {isCalling ? 'Calling...' : 'Call This Number'}
                </Button>
                <Button
                  variant="secondary"
                  className="mx-2"
                  onClick={handleRecord}
                  disabled={!isCalling}
                >
                  {isRecording ? 'Stop Recording' : 'Record Call'}
                </Button>
              </div>
              {isCalling && (
                <div className="call-status mt-3">
                  <h5>Status: {isRecording ? 'Recording...' : 'In Call'}</h5>
                </div>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dialer;
