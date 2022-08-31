import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios';
import xtype from 'xtypejs'

//custom
import NFTPlayerLarge from '../nftymix/NFTPlayerLarge'
import NFTImageLarge from '../nftymix/NFTImageLarge'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'

//Solidity Functions

import BuyNFTButton from "../nftySolidityButtons/BuyNFTButton"
import BuyLazyNFTButton from "../nftySolidityButtons/BuyLazyNFTButton"

// Cloud Functions
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils, BigNumber } from 'ethers';
import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { fixURL, fixImageURL } from "../nftyFunctions/fixURL"
import img from "../../assets/images/ethereum.png"
import { Seaport } from "@opensea/seaport-js";


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";

import styled from 'styled-components'

import { APP_ID, SERVER_URL } from '../../index'

const HeaderSection = styled.div `
    display:flex;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
    padding-top: 75px;
`;



function ProductPageToken() {
  
  
  const { tokenAddress, tokenId } = useParams();
  const { isInitialized, isAuthenticated, user } = useMoralis() 
  const [tokenUri, setTokenUri] = useState("")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState("")
  const { marketAddress, marketContractABI, storageAddress, storageContractABI } = useMoralisDapp()
  const marketContractABIJson = JSON.parse(marketContractABI)
  const storageContractABIJson = JSON.parse(storageContractABI)
  const [events, setEvents] = useState([{
    fromAddress: "",
    toAddress: "",
    tokenId
  }])
  const [transfers, setTransfers] = useState([{
    fromAddress: "",
    toAddress: "",
    tokenId
  }])
  const erc721 = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]`
  const [tokenOwner, setTokenOwner] = useState("")
  // const [ownerName, setOwnerName] = useState(`${owner}${name}`);
  const [nft, setNft] = useState([{
    price: "", 
    tokenId: "",
    tokenAddress: "",
    owner: "",
    gallery: "",
    image: "",
    name: "",
    description: "",
    tokenURI: "",
    lazy: ""
  }]);

  const appId = APP_ID;
  const serverUrl = SERVER_URL;   
  Moralis.start({ serverUrl, appId});


  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(async() => {
    
    await getNFTData();
    await fetchSeaportData();
    setIsLoading(false);

  }, []);

  const fetchMetadata = async() => {

    const signer = await ConnectWallet()

    const tokenContract = new ethers.Contract(tokenAddress, 
      JSON.parse(erc721), signer)

    const tokenURI = await tokenContract.tokenURI(tokenId)
    return tokenURI

  }

  const fetchSeaportData = async(offerer) => {
      // const options = {method: 'GET', headers: {Accept: 'application/json'}};

      // fetch(`https://testnets-api.opensea.io/v2/orders/goerli/seaport/offers?asset_contract_address=${tokenAddress}&token_ids=${tokenId}`, options)
      //   .then(response => response.json())
      //   .then(response => console.log(response))
      //   .catch(err => console.error(err));

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const seaport = new Seaport(provider);

      

  }


  const placeSeaportOffer = async(offerer, price) => {
      // const options = {
      //   method: 'POST',
      //   headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
      // };

      // fetch('https://testnets-api.opensea.io/v2/orders/rinkeby/seaport/offers', options)
      //   .then(response => response.json())
      //   .then(response => console.log(response))
      //   .catch(err => console.error(err));

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const seaport = new Seaport(provider);

      const { executeAllActions } = await seaport.createOrder(
      {
        offer: [
          {
            amount: ethers.utils.parseEther(price).toString(),
            // WETH
            token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          },
        ],
        consideration: [
          {
            itemType: "ERC721",
            token: tokenAddress,
            identifier: tokenId,
            recipient: offerer,
          },
        ],
        },
        offerer
      );


  }

  const handleTransfer = async(from, to, tokenId) => {
        
        let fromAddress = await fetchArtistName(from)
        let toAddress = await fetchArtistName(to)
        let ellipsis = "..." 

        console.log(from, to, "HELLOOOO")

        if (fromAddress===undefined) {
            fromAddress = ellipsis.concat(from.slice(33,43))
        }
        if (fromAddress.length === 25) {
            fromAddress = ellipsis.concat(from.slice(33,43))
        } 

        if (toAddress===undefined) {
            toAddress = ellipsis.concat(to.slice(33,43))
        }
        if (toAddress.length === 25) {
            toAddress = ellipsis.concat(to.slice(33,43))
        } 

        setEvents(previousEvents => [...previousEvents, {
            from: fromAddress,
            to: toAddress,
            tokenId: tokenId.toNumber()
        }])

        setTransfers(previousTransfers => [...previousTransfers, {
            from: from,
            to: to,
            tokenId: tokenId.toNumber()
        }])
  
    }

  const editAddress = (name, address) => {


      let ellipsis = "..." 
      
      let newAddress = name
      if (name===undefined) {
          newAddress = ellipsis.concat(address.slice(33,43))
      } else if (name.length === 25) {
          newAddress = ellipsis.concat(address.slice(33,43))
      } 
      return newAddress
  }

  const fetchProvenance = async() => {
    const signer = await ConnectWallet()
    const tokenContract = new ethers.Contract(tokenAddress, 
      JSON.parse(erc721), signer)
    console.log(ethers.BigNumber.from(tokenId), "GANG")
    const filterTransfer = tokenContract.filters.Transfer(null, null, ethers.BigNumber.from(tokenId))
    
    const transferItems = await tokenContract.queryFilter(filterTransfer)

    console.log(transferItems, "these transfers")
    let items = []
    for (const i in transferItems) {
  
        // await handleTransfer(transferItems[i]["args"]["from"], transferItems[i]["args"]["to"], transferItems[i]["args"]["tokenId"])
        let item = {
          fromAddress: transferItems[i]["args"]["from"],
          toAddress: transferItems[i]["args"]["to"],
          tokenId
        }
        items.push(item)
        //handleStart(item.tokenId, item.highestBid)
    }

    return items


  }

  const checkFileType = async(image) => {

    let file = fixURL(image)
  
    
    const req = await fetch(file, {method: "HEAD"})
    console.log(req.headers.get("content-type"), "This is the request result")
    setImageFile(req.headers.get("content-type"))
  }

  const fetchOwner = async() => {
    const signer = await ConnectWallet()

    const tokenContract = new ethers.Contract(tokenAddress, 
      JSON.parse(erc721), signer)

    const owner = await tokenContract.ownerOf(tokenId)
    return owner
  }


  const getNFTData = async() => {
    
    const tokenUri = await fetchMetadata()
    const meta = await axios.get(fixURL(tokenUri))
    const signer = await ConnectWallet()
    const transfers = await fetchProvenance()
    const artistPhoto = await fetchArtistPhoto(transfers[1].toAddress)
    let artistName = await fetchArtistName(transfers[1].toAddress)
    artistName = editAddress(artistName, transfers[1].toAddress)
    const tokenOwner = await fetchOwner()
    console.log(tokenOwner)
    let ownerPhoto
    let ownerName
    let price
    const marketplaceContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)
    let marketItemId
    if (marketAddress === transfers.slice(-1).pop().toAddress) {
        ownerPhoto = await fetchArtistPhoto(transfers.slice(-1).pop().fromAddress)
        ownerName = await fetchArtistName(transfers.slice(-1).pop().fromAddress)

        marketItemId = await marketplaceContract.getItemId(tokenAddress, tokenId)
        price = await marketplaceContract.getItemPrice(marketItemId)
        price = ethers.utils.formatEther(price)

        console.log(price, "GANG GOING UP")


 
    } else {
        ownerPhoto = await fetchArtistPhoto(transfers.slice(-1).pop().toAddress)
        ownerName = await fetchArtistName(transfers.slice(-1).pop().toAddress)
    }
    
    ownerName = editAddress(ownerName, transfers.slice(-1).pop().fromAddress)

    console.log("THIS WONT WORK")
    let imageLink;
    for (const j in meta.data) {
      if ((meta.data[j]).toString().includes('ipfs')) {
          imageLink = meta.data[j]
      }
    }

    await checkFileType(imageLink)

    

    setNft((previousNft) =>[{
      // price: object.get("price"), 
      price: price,
      tokenId: tokenId,
      isSold: true,
      //owner: object.get("buyerAddress").slice(-1)[0],
      //artist: object.get("signerAddress"),
      artistPhoto: artistPhoto,
      artistName: artistName,
      ownerPhoto: ownerPhoto,
      ownerName: ownerName,
      owner: ("...").concat(tokenOwner.slice(33,43)),
      //createdAt: object.get("createdAt").toUTCString(),
      image: imageLink,
      name: meta.data.name,
      description: meta.data.description,
      tokenURI: tokenUri
    }]);
    console.log(nft)
  };

  return (
    <>
      {!isLoading && (
        <HeaderSection>
            <Container fluid="sm">
            
                <center>
                    { (imageFile.toString().includes('png') || imageFile.toString().includes('gif') || imageFile.toString().includes('jpg') || 
              imageFile.toString().includes('jpeg') || imageFile.toString().includes('usemoralis')) ? (<NFTImageLarge output={nft[0].image}/>) : 
              (nft[0].coverPhotoURL) ? (<NFTAudioPlayer output={nft[0].coverPhotoURL} audio={nft[0].image}/>) : (<NFTPlayerLarge output={nft[0].image}/>) }
                </center>
                <hr/>
                <Row class="d-flex" style={{paddingBottom: "5px"}}>
                  <Col style={{fontWeight: "Bold"}}>Artist: {nft[0].artistPhoto && <img height="25" width="25" crossOrigin='true' 
                  crossoriginresourcepolicy='false' style={{borderRadius: "2rem", display: "inline"}} src={nft[0].artistPhoto}></img>} {nft[0].artistName}</Col>
                 <Col>
                  Owner: {nft[0].ownerPhoto && <img height="25" width="25" crossOrigin='true' crossoriginresourcepolicy='false' style={{borderRadius: "2rem", display: "inline"}} 
                  src={nft[0].ownerPhoto}></img>} {nft[0].ownerName}</Col>
               
                  
                
                </Row>
                <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        <div style={{fontWeight: "Bold", fontSize: 60, paddingTop: 40}}>{nft[0].name} {(nft[0].isSold) ? 
                        (<BuyNFTButton nft={nft[0]} marketAddress={marketAddress} marketContractABIJson={marketContractABIJson}></BuyNFTButton>) : 
                        (<BuyLazyNFTButton nft={nft[0]}></BuyLazyNFTButton>)}</div>
                        
                        <div style={{fontWeight: "Bold", fontSize: 16}}>Minted on: {nft[0].createdAt}</div>
                        
                        <div style={{fontWeight: "Bold", fontSize: 20, marginTop: 100, display: "flex"}}>List Price: <img src={img} height="30" width="30"></img>{nft[0].price}</div >
                        <div style={{fontWeight: "Bold", fontSize: 30, paddingBottom: 20}}><hr/>Description</div>
                        
                        <ListGroup style={{paddingBottom: 50}}>
                            
                            <ListGroup.Item style={{fontSize: 16, paddingTop: 20, paddingBottom: 20}}>{nft[0].description}</ListGroup.Item>
                            
                        </ListGroup>
                    </Col>
                    
                    <Col style={{marginLeft: "300px", paddingTop: 20}}>
                        <div style={{fontWeight: "Bold", fontSize: 30, paddingTop: 20, paddingBottom: 20}}><hr/>Provenance</div>
                        <ListGroup style={{paddingTop: "10px"}}>
                            <ListGroup.Item style={{fontWeight: "Bold"}}>
                              Bid 1
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                </Row>
            </Container>
        </HeaderSection>
      )}
    </>
  );
};

export default ProductPageToken;