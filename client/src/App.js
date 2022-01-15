import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/merch").then(
      res => res.json()
    ).then(
      data => { 
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (

    <div className="App">
      {(typeof data.merch === 'undefined') ? (
        <p>Loading...</p>
      ) : (
          data.merch.map((merch,i) => (
            <p key={i}>{merch}</p>
          ))
      )}
    </div>
  );
}

export default App;
