import logo from './logo.svg';
/*import './custom-strap.scss';*/
import "./App.css"

import React, { useState, useEffect, Component } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Landing from './page-components/Landing'
import Onboard from './page-components/Onboard'

function App() {

  /*const [data, setData] = useState([{}])*/

  /*
  useEffect(() => {
    fetch("/merch").then(
      res => res.json()
    ).then(
      data => { 
        setData(data)
        console.log(data)
      }
    )
  }, []) */

  return (

   
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboard" element={<Onboard />} />
        </Routes>
      </Router>
    



    /*
    <div className="App">
      {(typeof data.merch === 'undefined') ? (
        <p>Loading...</p>
      ) : (
          data.merch.map((merch,i) => (
            <p key={i}>{merch}</p>
          ))
      )}
    </div> */
  );

}

export default App;
