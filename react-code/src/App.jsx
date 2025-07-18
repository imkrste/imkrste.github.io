import { useState } from 'react'
import './App.css'

function App() {
   const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [people, setPeople] = useState('');
  const [diet, setDiet] = useState('');
  const [guests, setGuests] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
    
    <form onSubmit={handleSubmit}>
      <h1>Event RSVP FORM</h1>
    <label >Name: 
    <input 
     type="text"
     value={name}
     onChange={e => setName(e.target.value)}
     placeholder="Your name"
     required
     /> 
     </label>
    
    <label>Email: 
    <input 
    type="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    placeholder="Email"
    required
    />
    </label>
    
    <label>Number of attendees: 
    <input 
    type="number"
    min="1"
    value={people}
    onChange={e => setPeople(e.target.value)}
    required
    placeholder="Number of Attendees"
    /> 
    </label>

  <label>Dietary preferences: 
  <input type="text"
  placeholder="Dietary Preferences: (Optional)"
  value={diet}
  onChange={e => setDiet(e.target.value)}
  /> 
  </label>
  
  <label>Bringing additional guests?
    <input 
    type="checkbox" 
    checked={guests}
    onChange={e => setGuests(e.target.checked)}
    />
    
  </label>
 

  <button type="submit">Submit</button>
    </form>

    
    {isSubmitted ? <div className="result"> 
      <p>RSVP Submitted!</p>
      <p><span class="bold">Name</span>: {name}</p>
      <p><span class="bold">Email</span>: {email}</p>
      <p><span class="bold">Number of Attendees</span>: {people}</p>
      <p><span class="bold">Dietary Preference</span>: {diet ? <span>{diet}</span> : <span>None</span>} </p>
      <p><span class="bold">Additional Guests</span>: {guests ? <span>Yes</span> : <span>No</span>}</p>
      </div> : "" }
      
    
    </>
  )
}
export default App
