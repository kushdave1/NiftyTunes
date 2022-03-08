import logo from './logo.svg';
/*import './custom-strap.scss';*/
import "./App.css"

import React, { useState, useEffect, Component } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Landing from './page-components/Landing'
import Onboard from './page-components/Onboard'
import CreateNFT from './page-components/CreateNFT';
import Explore from './page-components/Explore';

import APIService from './services/APIService';

function App() {

 
  return (
    
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/createnft" element={<CreateNFT />}/>
          <Route path="/marketplace" element={<Explore />} />
        </Routes>
      </Router>
    

  );

}

export default App;
