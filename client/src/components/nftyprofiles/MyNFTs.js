import React, {useState, useEffect} from 'react';
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis"

import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
import {useNavigate} from 'react-router'


import checkmark from "../../assets/images/checkmark.png"
import error from "../../assets/images/error.png"

import { checkFileType } from "../nftyFunctions/checkFileType"


import Moralis from 'moralis'
import $ from "jquery"

import { useNFTBalance } from "../../hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Tooltip, Spin, Input } from "antd";
import { useIPFS } from "hooks/useIPFS";

import nftyimg from '../../assets/images/NT_White_Isotype.png'

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { useMoralisWeb3Api } from "react-moralis";

import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import { fetchOwnedIds } from '../nftyFunctions/FetchTokenIds'

import ProductSkeleton from '../nftyloader/ProductSkeleton'
import ProductCardsLayoutLazy from '../nftylayouts/ProductCardsLayoutLazy'
import ProductListLayout from '../nftylayouts/ProductListLayout'
import styled from 'styled-components'


const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

const MarketPlaceSection = styled.div `
    padding-top: 20px;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
    padding-bottom: 20px;
`;



function MyNFTs() {
  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const { getNFTBalances, data, error, isFetching } = useNFTBalances();
  const [address, setAddress] = useState();
  const [nftData, setNftData] = useState();
  const [nfts, setNFTs] = useState([{name: "",
                  description: "",
                  image: "",
                  owner:"",
                  tokenId: "",
                  tokenAddress: ""}]);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, collectionContractABI, collectionAddress } = useMoralisDapp();
  const storageContractABIJson = JSON.parse(storageContractABI);
  const collectionContractABIJson = JSON.parse(collectionContractABI);
  const Web3Api = useMoralisWeb3Api();
  const [visible, setVisibility] = useState(false);
  const marketContractABIJson = JSON.parse(marketContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);
  const contractProcessor = useWeb3ExecuteFunction();
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ListedNFTs");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (nft) => {
    setShow(true);
    getApprovedStatus(nft)
  }
  const [width, setWindowWidth] = useState()
  const [approveLoading, setApproveLoading] = useState(false)
  const [approveSuccess, setApproveSuccess] = useState(false)
  const [approveError, setApproveError] = useState(false)
  const [approvedStatus, setApprovedStatus] = useState(false)
  let navigate = useNavigate();

  useEffect(async() => {

        updateDimensions();

        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize",updateDimensions);

    }, [])

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }



  useEffect(async() => {
        if(!user) return null
        setAddress(user.get('ethAddress'));

        getNFT();
        setApproveSuccess(false)
        setApproveError(false)

        // const items = await fetchOwnedIds(marketAddress, marketContractABI, storageAddress, storageContractABI);

        // for (const i in items) {
        //     let item = {
        //         name: items[i].name,
        //         description: items[i].description,
        //         image: items[i].image,
        //         owner: items[i].owner,
        //         tokenId: items[i].tokenId,
        //         tokenAddress: items[i].tokenAddress
        //     }
        //     console.log(item)
        //     if (nfts.includes(item) === false) {
        //       setNFTs((previousNft) => [...previousNft, {
        //           name: items[i].name,
        //           description: items[i].description,
        //           image: items[i].image,
        //           owner: items[i].owner,
        //           tokenId: items[i].tokenId,
        //           tokenAddress: items[i].tokenAddress
        //       }])}
        // }
        
 
        setTimeout(() => {
          setLoading(false)
        }, 1000);
    }, [user]);

  
  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  function UrlExists(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        try {
          http.send();
        } catch {
          return false
        }

        return (http.status!=404 || http.status!=503 || http.status!=403);
    }


  const getNFT = async() => {
        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const network = await provider.getNetwork(); 
        const name = "eth";
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress();
        console.log(name, "type")
        
        // try {
        //   await getNFTBalances({ params: { chain: name } })
        // } catch {
        //   return;
        // }

        const dataMarkets = await getNFTBalances({ params: { chain: name } })
        
        const results = dataMarkets.result
        console.log(results)
        const items = []
        let image = ''
        let imageBon = ''
        let imageLink = ''
        //let meta = ''
      
        for (const i in results) {
          
            const object = results[i];


            let meta
            if (object?.token_uri) {
              try {
                UrlExists(object.token_uri)
                meta = await axios.get(object.token_uri)
              } catch {
                try {
                  UrlExists(fixURL(object.token_uri))
                  meta = await axios.get(fixURL(object.token_uri))
                } catch {
                  console.log(object.token_uri)
                  meta = {data: {
                    name: "",
                    description: "",
                    location: "",
                    date: "",
                    tier: "",
                    artist: ""
                  }
                }
              }
              }

              
              for (const j in meta.data) {
                if ((meta.data[j]).toString().includes('ipfs') || j === 'image') {
                    if (UrlExists(meta.data[j]) && meta.data[j].toString().includes('https')) {
          
                      imageLink = meta.data[j]
                    } else {
                      imageLink = meta.data[j]

                    }
                }
              }
              
            
              const fileType = await checkFileType(imageLink)
              console.log(fileType, imageLink, "BUSHU")

              let item = {
                  name: meta.data['name'],
                  description: meta.data['description'],
                  tier: meta.data['tier'],
                  location: meta.data['location'],
                  date: meta.data['date'],
                  artistName: meta.data['artist'],
                  image: imageLink,
                  owner: object.owner_of,
                  tokenId: object.token_id,
                  tokenAddress: object.token_address,
                  fileType: fileType,
                  lazy: false,
                  isSold: true
              }
              if (nfts.includes(item) === false && UrlExists(imageLink) || nfts.includes(item) === false && UrlExists(fixURL(imageLink))) {
                console.log(imageLink,  "KUSHU")
                setNFTs((previousNft) => [...previousNft, {
                    name: meta.data['name'],
                    description: meta.data['description'],
                    tier: meta.data['tier'],
                    location: meta.data['location'],
                    date: meta.data['date'],
                    artistName: meta.data['artist'],
                    image: imageLink,
                    owner: object.owner_of,
                    fileType: fileType,
                    tokenId: object.token_id,
                    tokenAddress: object.token_address,
                    lazy: false,
                    isSold: true
                }])}
            }      
        }
      
    }



  const getApprovedStatus = async(nft) => {

    const signer = await ConnectWallet()
    
    const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)

    const tokenContract = new ethers.Contract(nft.tokenAddress, 
    JSON.parse(`
      [{
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }]`), signer)
    let marketApproved
    try {
      marketApproved = await tokenContract.getApproved(nft.tokenId)
      console.log(marketApproved, "This market approved")
    } catch (e) {
      marketApproved = false
    }
    if (marketApproved === marketAddress) {
      setApprovedStatus(true)
    } else {
      setApprovedStatus(false)
    }


    console.log('success for sure')
  }


  
  const ApproveNFT = async(nft) => {

    setApproveSuccess(false)
    setApproveError(false)
    
    const signer = await ConnectWallet()
    
    const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)
    console.log(nft)
    const tokenContract = new ethers.Contract(nft.tokenAddress, 
    JSON.parse(`
    [{
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]`), signer)
    let transactionApprove;
    setApproveLoading(true)
    try {
      transactionApprove = await tokenContract.approve(marketAddress, nft.tokenId)
      await transactionApprove.wait()
      setApproveLoading(false)
      setApproveSuccess(true)
    } catch (e) {
      console.log(e)
      setApproveLoading(false)
      setApproveError(true)
    }
    
    console.log('success for sure')
  }




  const ListNFT = async(nft, listPrice) => {
    
    const signer = await ConnectWallet()
    const price = ethers.utils.parseUnits(listPrice, 'ether')
    
    const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)

    let transaction = await marketplaceContract.resellToken(nft.tokenId, price, nft.tokenAddress)
    await transaction.wait()
    console.log('success for sure')

  }
    
  return (
    <>
    {(responsive.showTopNavMenu) ? (
      
      <MarketContainer>
      <MarketRow>
      
    <ProductListLayout>

              {loading?
                  //render skeleton when loading
                (Array(8)
                .fill()
                .map((item, index) => {
                    return(
                        <ProductSkeleton key={index} />
                    )
                  })) : (
                nfts && nfts.map((nft, index) => {
                  if (nft.name !== "") { 
                    return(
      
                    <ProductCardsLayoutLazy pageFrom="MyNFTs" key={index} owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} price={nft.price} 
                    handleShow={handleShow} handleSellClick={handleSellClick} tokenAddress={nft.tokenAddress} tokenId={nft.tokenId}
                    />


                  )}}
              ))
              }
      {(nfts.length === 0) ? (<>
              <NoItemsBox>
                <NoItemsLabel>
                  No items for display yet.
                </NoItemsLabel>
                <NoItemsStartCollecting onClick={()=>navigate("/marketplace")}>
                  <CollectingText>
                    Start Collecting
                  </CollectingText>
                </NoItemsStartCollecting>
              </NoItemsBox>
              </>): (<></>)}
    </ProductListLayout>
    
    </MarketRow>
    </MarketContainer>
    
    ) : (
      
    <div style={{display: "flex", top: "500px", left: "calc(50% - 322px/2 - 5px)", position: "absolute"}}>
    <ProductListLayout>
      <React.Fragment>

              {loading?
                  //render skeleton when loading
                (Array(4)
                .fill()
                .map((item, index) => {
                    return(
                        <ProductSkeleton key={index} />
                    )
                  })) : (
                nfts && nfts.map((nft, index) => {
                  if (nft.name !== "") { 
                    return(
      
                    <ProductCardsLayoutLazy pageFrom="MyNFTs" key={index} owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} price={nft.price} 
                    handleShow={handleShow} handleSellClick={handleSellClick} tokenAddress={nft.tokenAddress} tokenId={nft.tokenId}
                    />


                  )}}
              ))
              }
      </React.Fragment>
      {(nfts.length === 0) ? (<>
              <NoItemsBox>
                <NoItemsLabel>
                  No items for display yet.
                </NoItemsLabel>
                <NoItemsStartCollecting onClick={()=>navigate("/marketplace")}>
                  <CollectingText>
                    Start Collecting
                  </CollectingText>
                </NoItemsStartCollecting>
              </NoItemsBox>
              </>): (<></>)}
    </ProductListLayout>
    </div>
    )}
    
    <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
    
        <Modal.Header style={{backgroundColor: "black"}} >
            <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            List your NFT
        </Modal.Title>
        <Form style={{padding: "30px"}}>
            <Form.Group className="mb-3" controlId="formTwitter">
                <Form.Label>Approve your NFT to be Listed on our Marketplace</Form.Label>
                {(approvedStatus) ? (
                  <Row>
                    <Col md={6} >
                      <div style={{border: "1px solid red", padding: "5px", borderRadius: '2rem', marginTop: "5px", display: "inline"}}>Approved for Listing</div>
                    </Col>
                </Row>
                ) : 
                (<Row>
                  <Col md={3}>
                    <Button variant = 'dark' style={{borderRadius: "2rem", marginTop: "5px", display: "inline"}} onClick={() => ApproveNFT(nftToSend)}>Approve {" "}</Button>
                  </Col>
                  <Col className="align-items-center d-flex" md={2}>
     
                    {approveLoading && 
                    <Spinner animation="border" />}
                    {approveSuccess && 
                    <img height="30px" width="30px" src={checkmark}></img>}
                    {approveError && 
                    <img height="30px" width="30px" src={error}></img>}
                  </Col>
                  <Col md={7}>
                  </Col>
                </Row>)}
            </Form.Group>
            
            <Form.Group className="my-3" controlId="listPrice">
                <Form.Label>Enter your Listing Price</Form.Label>
                <Row className="my-1">
                  <Col xs={4}>
                  <Form.Control 
                  type="list" 
                  placeholder="List Price" 
                  onInput={e => setPrice(e.target.value)}/>
                  <Form.Text className="text-muted">
                  </Form.Text>
                  </Col>
                </Row>
                <Button variant = 'dark' style={{borderRadius: "2rem", float: "right"}} onClick={() => ListNFT(nftToSend, price)}>List your NFT</Button>
               
            </Form.Group>
            
        </Form>
    </Modal>
    </>
       
    
  );
}

export default MyNFTs;

const MarketContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 40px;

    position: absolute;
    width: 1300px;
    height: 1048px;
    left: calc(50% - 1300px/2);
    top: 300px;
`

const MarketRow = styled.div`

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    width: 1300px;
    height: 382px;
`

const NoItemsBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 254px;
height: 123px;
`

const NoItemsLabel = styled.div`
width: 254px;
height: 27px;

/* Lead */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 27px;
/* identical to box height */


color: #000000;
`

const NoItemsStartCollecting = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 20px 38px;
gap: 10px;

width: 195px;
height: 56px;

background: #000000;
border-radius: 50px;
`

const CollectingText = styled.div`
width: 119px;
height: 16px;

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */
white-space: nowrap;


color: #FFFFFF;
`