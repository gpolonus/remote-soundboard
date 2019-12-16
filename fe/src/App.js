
import React, { useState } from 'react'

function App() {
  const [ peer, setPeer ] = useState('')

  function initiate() {

  }

  function connect() {

  }

  return (
    <div className="App">
      <h1>Many Sounds</h1>
      <div>
        <button onClick={ initiate }>Host</button>
        <button onClick={ connect }>Sender</button>
      </div>
    </div>
  );
}

export default App;
