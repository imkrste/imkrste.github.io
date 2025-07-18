import { useState } from 'react'
import './App.css'

function App() {

  const [player, setPlayer] = useState("X")
  
  const game = () => {
    if (player === "X") {
      setPlayer("O")
    }
    else {
      setPlayer("X");
    }
    return player;
  }

  return (
    <>
    <div className="title-container">
    <h1>TIC TAC TOE</h1>
    <h3>NEXT PLAYER: {player}</h3>
    </div>
    <div className='container'>
      <button onClick={game} id="1" className="square"></button>
      <button onClick={game} id="2" className="square"></button>
      <button onClick={game} id="3" className="square"></button>
      <button onClick={game} id="4" className="square"></button>
      <button onClick={game} id="5" className="square"></button>
      <button onClick={game} id="6" className="square"></button>
      <button onClick={game} id="7" className="square"></button>
      <button onClick={game} id="8" className="square"></button>
      <button onClick={game} id="9" className="square"></button>
      
       </div>
  
    </>
  )
}

export default App
