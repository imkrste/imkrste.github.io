import { useState, useMemo } from 'react'
import './App.css'
import { use } from 'react';

function App() {

  const exchangeRate = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 156.7
};

  const [amount, setAmount] = useState(1);
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("EUR");

   const converted = useMemo(() => {
    console.log("Calculating conversion..."); 

    return currency1 === "USD" 
      ? (amount * exchangeRate[currency2]).toFixed(2) 
      : (amount / exchangeRate[currency1] * exchangeRate[currency2]).toFixed(2);
      
  }, [amount, currency1]);

   const options = () => 
    Object.keys(exchangeRate).map(money => 
      <option key={money} value={money}>{money}</option>
    );


  return (
    <>
    <div className='converter-container'>
    <h1>Currency Converter</h1>
    <h3>USD to EUR conversion</h3>
    <input type="number" value={amount} onChange={e => setAmount(e.target.value)}/>
    <p className='naslov'>Start Currency</p>
    <select value={currency1} onChange={e => setCurrency1(e.target.value)}>
    {options()}
    </select>
    <p className='naslov'>Converted Currency</p>
    <select value={currency2} onChange={e => setCurrency2(e.target.value)}>
    {options()}  
    </select>
    <p className='converted-amount'>Converted ammount: {converted} {currency2}</p>
    </div>
    </>
  )
}

export default App
