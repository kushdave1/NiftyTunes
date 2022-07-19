import logo from './logo.svg';
/*import './custom-strap.scss';*/
import "./App.css"
import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import FooterPage from './components/nftynavs/Footer'

//Pages
import Landing from './components/nftypages/Landing'
import CreateNFT from './components/nftypages/CreateNFT'
import Explore from './components/nftypages/Explore'
import MyProfile from './components/nftypages/MyProfile'
import MyListedNFTs from './components/nftyprofiles/MyListedNFTs'
import MyNFTs from './components/nftyprofiles/MyNFTs'
import MultiStepForm from './components/nftypages/MultiStepForm'
import MyCollections from './components/nftyprofiles/MyCollections'
import MyWETHBalance from './components/nftyprofiles/MyWETHBalance'
import Staking from './components/nftypages/Staking'
import ProductPage from './components/nftypages/ProductPage'
import LiveMint from './components/nftypages/LiveMint'
import LiveCollectionPage from './components/nftypages/LiveCollectionPage'

//Layout
import PageLayout from './components/nftylayouts/PageLayout'

function App() {

  return (
    
      <Router>
        <PageLayout>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/collections" element={<MyCollections />}/>
          <Route path="/staking" element={<Staking />}/>
          <Route path="/wethbalance" element={<MyWETHBalance />}/>
          <Route path="/createnft" element={<CreateNFT />}/>
          <Route path="/marketplace" element={<Explore />} />
          <Route path="/live" element={<LiveMint />} />
          <Route path="/profile" element={<MyProfile />} >
              <Route path="onsale" element={<MyListedNFTs />} />
              <Route path="sold" element={console.log("sold")} />
              <Route path="created" element={console.log("created")} />
              <Route path="owned" element={<MyNFTs />} />
              <Route path="activity" element={console.log("activity")} />
          </Route>
          <Route path="/multistep" element={<MultiStepForm />} />
          <Route path="/:owner/:name" element={<ProductPage />} />
          <Route path="/live/:liveMintAddress/:collectionName" element={<LiveCollectionPage />} />
        </Routes>
        </PageLayout>
        <FooterPage />
      </Router>
      

  );

}

export default App;
