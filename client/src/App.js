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
import ArtistProfile from './components/nftypages/ArtistProfile'
import MyListedNFTs from './components/nftyprofiles/MyListedNFTs'
import MyNFTs from './components/nftyprofiles/MyNFTs'
import MultiStepForm from './components/nftypages/MultiStepForm'
import MyCollections from './components/nftyprofiles/MyCollections'
import MyWETHBalance from './components/nftyprofiles/MyWETHBalance'
import Staking from './components/nftypages/Staking'
import ProductPage from './components/nftypages/ProductPage'
import ProductPageToken from './components/nftypages/ProductPageToken'
import LiveMint from './components/nftypages/LiveMint'
import LiveCollectionPage from './components/nftypages/LiveCollectionPage'
import ComingSoon from './components/nftypages/ComingSoon'
import UpcomingCollectionPage from './components/nftyprofiles/LiveEvents/Upcoming'
import PastCollectionPage from './components/nftyprofiles/LiveEvents/Past'
import ProfileInfo from './components/nftyModals/ProfileModals/ProfileInfo'
import ContactModal from './components/nftyModals/ProfileModals/ContactModal'
import ArtistItems from './components/nftyprofiles/ArtistItems'
import Gallery from './components/nftypages/Gallery'


//Layout
import PageLayout from './components/nftylayouts/PageLayout'

function App() {

  return (
    
      <Router>
        <PageLayout>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          {/* <Route path="/collections" element={<MyCollections />}/>
          <Route path="/staking" element={<Staking />}/>
          <Route path="/wethbalance" element={<MyWETHBalance />}/>
          <Route path="/createnft" element={<CreateNFT />}/> */}
          {/* <Route path="/marketplace" element={<Explore />} /> */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artist/:ethAddress" element={<ArtistProfile />} >

            <Route path="items" element={<ArtistItems />} />
            {/* <Route path="collections" element={<ArtistCollections />} /> */}
          </Route>

          <Route path="/marketplace" element={<ComingSoon />} />
          <Route path="/live" element={<LiveMint />} />
          <Route path="/comingsoon" element={<ComingSoon />} />
          <Route path="/contact-us" element={<ContactModal />} />
          <Route path="/profile/edit" element={<ProfileInfo />}/>
          <Route path="/profile" element={<MyProfile />} >
              
              <Route path="onsale" element={<MyListedNFTs />} />
              <Route path="sold" element={console.log("sold")} />
              <Route path="created" element={console.log("created")} />
              <Route path="owned" element={<MyNFTs />} />
              <Route path="activity" element={console.log("activity")} />
          </Route>
          <Route path="/multistep" element={<MultiStepForm />} />
          {/* <Route path="/lazy/:owner/:name" element={<ProductPage />} />
          <Route path="/:tokenAddress/:tokenId" element={<ProductPageToken />} /> */}
           <Route path="/lazy/:owner/:name" element={<ComingSoon />} />
          <Route path="/:tokenAddress/:tokenId" element={<ComingSoon />} />
          <Route path="/live/:signerAddress/:collectionName" element={<LiveCollectionPage />} />
        </Routes>
        </PageLayout>
      </Router>
      

  );

}

export default App;
