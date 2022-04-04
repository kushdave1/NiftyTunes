import logo from './logo.svg';
/*import './custom-strap.scss';*/
import "./App.css"
import { useMoralis } from "react-moralis";
import React, { useState, useEffect, Component } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Landing from './page-components/Landing'
import CreateNFT from './page-components/CreateNFT';
import Explore from './page-components/Explore';
import MyProfile from './page-components/MyProfile';
import MyListedNFTs from './components/MyListedNFTs';
import MyNFTs from './components/MyNFTs';
import MultiStepForm from './page-components/MultiStepForm'
import APIService from './services/APIService';


function App() {
  /*const { isWeb3Enabled, enableWeb3,isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (!isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled]);*/

  return (
    
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/createnft" element={<CreateNFT />}/>
          <Route path="/marketplace" element={<Explore />} />
          <Route path="/profile" element={<MyProfile />} >
              <Route path="onsale" element={<MyListedNFTs />} />
              <Route path="sold" element={console.log("sold")} />
              <Route path="created" element={console.log("created")} />
              <Route path="owned" element={<MyNFTs />} />
          </Route>
          <Route path="/multistep" element={<MultiStepForm />} />
        </Routes>
      </Router>
    

  );

}

export default App;
