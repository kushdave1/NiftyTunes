//React
import React, {useState, useEffect} from 'react';

//Bootstrap
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

//moralis
import Moralis from 'moralis'
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis"
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";


//web3 
import { useNFTBalance } from "../hooks/useNFTBalance";
import { useWeb3ExecuteFunction } from "react-moralis";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

//Axios
import axios from 'axios';



function MyListedNFTs() {
  const {isAuthenticated, user} = useMoralis();
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
  const [address, setAddress] = useState();
  const [nfts, setNFTs] = useState([]);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ItemImages");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  
  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };


  useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'));
        NFTBalancesListed();
    }, [user]);
  
  const fixURL = (url) => {
    if(url.startsWith("ipfs")){
      return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
    }
    else {
      return url+"?format=json"
    }
  };
  const fixImageURL = (url) => {
    if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
    }
    else {
      return url+"?format=json"
    }
  };



  const NFTBalancesListed = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)

    const data = await marketplaceContract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      console.log(meta)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: fixImageURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        tokenURI
      }
      return item
    }))
    setNFTs(items)
    console.log(items);
    setLoading(true) 
  }


  const deListNFT = async(nft) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    let listingPrice = await marketplaceContract.getListingPrice()
    console.log(nft)
    let transaction = await marketplaceContract.delistToken(nft.tokenId)
    await transaction.wait()
    console.log('successfully delisted')

  }


  return (
    
    <Container>
      <Row>
        {nfts && nfts.slice(0,5).map((nft, index) => (
        <Col>
          <Card className="bg-dark shadow-sm animate__animated animate__fadeIn" border="light" style={{ width: '20rem', height: '25rem', borderRadius:'1rem' }} >
                  <video key="{nft.image}" 
                    style={{borderRadius:'1rem' }} 
                    src={nft.image} 
                    loop={true}
                    autoPlay
                    muted
                    crossOrigin="true" 
                    className = "p-2"/>
            <Card.Body key="parent">
              <Row className="justify-content-center">
                <h2 className="fw-bold text-light mb-0">{nft.name}</h2>
                <small className="text-light" >{nft.description}</small>
              </Row>
              <Row>
                <Button onClick={() => {handleShow(); handleSellClick(nft)}}>Delist this NFT</Button>
              </Row>
            </Card.Body>
          </Card>
          <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <div>
              {/* <button onClick={() => approveAll(nftToSend)}>Approve</button> */}
              <Button onClick={() => deListNFT(nftToSend)}>DeList</Button>
            </div>
          </Modal>
        </Col>
        )
        )} 
      </Row>
      
      
    </Container>
    
  );
}

export default MyListedNFTs;

