import logo from './logo.svg';
/*import './custom-strap.scss';*/
import "./App.css"
import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

//Pages
import Landing from './components/nftypages/Landing'
import CreateNFT from './components/nftypages/CreateNFT'
import Explore from './components/nftypages/Explore'
import MyProfile from './components/nftypages/MyProfile'
import MyListedNFTs from './components/nftyprofiles/MyListedNFTs'
import MyNFTs from './components/nftyprofiles/MyNFTs'
import MultiStepForm from './components/nftypages/MultiStepForm'

//Layout
import PageLayout from './components/nftylayouts/PageLayout'

function App() {

  return (
    
      <Router>
        <PageLayout>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/createnft" element={<CreateNFT />}/>
          <Route path="/marketplace" element={<Explore />} />
          <Route path="/profile" element={<MyProfile />} >
              <Route path="onsale" element={<MyListedNFTs />} />
              <Route path="sold" element={console.log("sold")} />
              <Route path="created" element={console.log("created")} />
              <Route path="owned" element={<MyNFTs />} />
              <Route path="activity" element={console.log("activity")} />
          </Route>
          <Route path="/multistep" element={<MultiStepForm />} />
        </Routes>
        </PageLayout>
      </Router>
    

  );

}

export default App;
