import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {

  const [otpnumber, setOtpnumber] = useState("Click 'Generate OTP' to get a code");
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const randomNumber = () => setOtpnumber(Math.trunc(Math.random() * 900000) + 100000);

  const handleClick = () => {
    randomNumber();
    setCount(5); 
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev === 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
            return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    
    return () => clearInterval(intervalRef.current);
  }, []);

  const buttonEnabled = count === 0;

  return (
    <>
     <div className="container">
      <h1 id="otp-title">OTP Generator</h1>
      <h2 id="otp-display">{otpnumber}</h2>
      {typeof otpnumber === "string" ? "" : count === 0 ? <p id="otp-timer">OTP expired. Click the button to generate a new OTP</p> : <p id="otp-timer">Expires in: {count} seconds</p>}
      <button disabled={!buttonEnabled} id="generate-otp-button" onClick={handleClick}>Generate OTP</button>

     </div>
    </>
  )
}

export default App
