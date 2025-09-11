import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [section, setSection] = useState('email'); // 'email', 'otp', 'success'
  const [timerActive, setTimerActive] = useState(false);
  const endTimeRef = useRef(null);

  useEffect(() => {
    if (!timerActive) return;

    const tick = () => {
      const remaining = Math.max(Math.round((endTimeRef.current - Date.now()) / 1000), 0);
      setTimeLeft(remaining);

      if (remaining > 0) {
        requestAnimationFrame(tick);
      } else {
        alert('OTP has expired. Please generate a new one.');
        resetToEmail();
      }
    };

    tick();
  }, [timerActive]);

  const resetToEmail = () => {
    setSection('email');
    setEmail('');
    setOtpInput('');
    setTimeLeft(60);
    setTimerActive(false);
    endTimeRef.current = null;
  };

  const handleSendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/send-otp', { // <-- updated port
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setDisplayEmail(email);
        setSection('otp');
        setOtpInput('');
        setTimerActive(true);
        endTimeRef.current = Date.now() + 60 * 1000;
      } else {
        alert(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      alert('Error sending OTP. Please try again.');
      console.error(error);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otpInput)) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/verify-otp', { // <-- updated port
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: displayEmail, otp: otpInput }),
      });

      const data = await response.json();
      if (response.ok) {
        setTimerActive(false);
        setSection('success');
      } else {
        alert(data.error || 'Invalid OTP. Please try again.');
        setOtpInput('');
      }
    } catch (error) {
      alert('Error verifying OTP. Please try again.');
      console.error(error);
    }
  };

  const maskedEmail = displayEmail.replace(/(.{2}).+(@.+)/, '$1****$2');

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">OTP Verification & Login</h1>

        {section === 'email' && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOTP}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 w-full"
            >
              Send OTP
            </button>
          </div>
        )}

        {section === 'otp' && (
          <div>
            <p className="text-gray-600 mb-2">
              OTP sent to <span className="font-semibold">{maskedEmail}</span>
            </p>
            <p className="text-gray-600 mb-4">Time remaining: {timeLeft}s</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otpInput}
              onChange={(e) =>
                setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 w-full mb-2"
            >
              Verify OTP
            </button>
            <button
              onClick={handleSendOTP}
              disabled={timerActive}
              className={`${
                timerActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-semibold py-2 px-4 rounded transition duration-300 w-full`}
            >
              Resend OTP
            </button>
          </div>
        )}

        {section === 'success' && (
          <div>
            <p className="text-green-600 font-semibold mb-4">Login Successful!</p>
            <button
              onClick={resetToEmail}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 w-full"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
