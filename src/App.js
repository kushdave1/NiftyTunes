import logo from './logo.svg';
/*import './custom-strap.scss';*/
import "./App.css"
import { useMoralis } from "react-moralis";
import React, { useState, useEffect, Component } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Landing from './page-components/Landing'
import Onboard from './page-components/Onboard'
import CreateNFT from './page-components/CreateNFT';
import Explore from './page-components/Explore';
import ViewMyNFTs from './page-components/ViewNFTs';
import ViewListedNFTs from './page-components/ViewListedNFTs';

import APIService from './services/APIService';


function App({ isServerInfo }) {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  const [inputValue, setInputValue] = useState("explore");

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);
  console.log('succcess');
  return (
    
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/createnft" element={<CreateNFT />}/>
          <Route path="/marketplace" element={<Explore />} />
          <Route path="/viewnfts" element={<ViewMyNFTs />} />
          <Route path="/viewlistednfts" element={<ViewListedNFTs />} />
        </Routes>
      </Router>
    

  );

}

export default App;
