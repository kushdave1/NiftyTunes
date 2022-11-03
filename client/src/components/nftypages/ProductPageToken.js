import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"
import ProductPageSkeleton from "../nftyloader/ProductPageSkeleton"

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

//Explore components
import NFTTokenIds from '../nftymarketplace/NFTTokenIds'

//Layouts
import ProductListLayout from '../nftylayouts/ProductListLayout'


import { useMoralisWeb3Api } from "react-moralis";

import DefaultProfilePicture from '../../assets/images/gorilla.png';

//custom
import NFTPlayerLarge from '../nftymix/NFTPlayerLarge'
import NFTImageLarge from '../nftymix/NFTImageLarge'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'
import BandLayoutLarge from '../nftylayouts/BandLayoutLarge'


//Solidity Functions

import BuyNFTButton from "../nftySolidityButtons/BuyNFTButton"
import { BuyNFT } from '../nftymarketplace/BuyNFT'
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
  position: relative;
  width: 100%;
  height: 1685px;

  background: #F6A2B1;
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
  const [events, setEvents] = useState([])

  const [live, setLive] = useState(false)
  const [transfers, setTransfers] = useState([{
    fromAddress: "",
    toAddress: "",
    tokenId
  }])
  const { chainId } = useMoralis();
  const [finalTransfers, setFinalTransfers] = useState([])
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


  const editTimestamp = (timestamp) => {

    const day = timestamp.getDate()
    const month = timestamp.getMonth()
    const year = timestamp.getFullYear()

    return `${month+1}/${day}/${year}`

  }

  const handleTransfer = async(index, block_timestamp, from, to, tokenId) => {
        
        let fromAddress = await fetchArtistName(from)
        let fromPhoto = await fetchArtistPhoto(from)
        let toAddress = await fetchArtistName(to)



        fromAddress = editAddress(fromAddress, from)
        toAddress = editAddress(toAddress, to)



        const timestamp = editTimestamp(block_timestamp)

        setEvents(previousEvents => [...previousEvents, {
            id: index,
            blockNumber: timestamp,
            fromPhoto: fromPhoto,
            from: fromAddress.toString(),
            to: toAddress.toString(),
            tokenId: tokenId,
            eventName: "Transfer"
        }])

        setTransfers(previousTransfers => [...previousTransfers, {
            id: index,
            blockNumber: timestamp,
            fromPhoto: fromPhoto,
            from: from.toString(),
            to: to.toString(),
            tokenId: tokenId
        }])
  
  }

  const sortEvents = () => {
      let currEvents = events
      

      currEvents.sort((a,b) => {
          return a.blockNumber-b.blockNumber
        } 
      )

      setEvents(currEvents)

  }


  const editAddress = (name, address) => {


      let ellipsis = "..." 
      
      let newAddress = name
      if (name===undefined) {
          newAddress = ellipsis.concat(address.slice(37,43))
      } else if (name.length === 25) {
          newAddress = ellipsis.concat(address.slice(37,43))
      } 
      return newAddress
  }

  

  const fetchProvenance = async() => {
    const signer = await ConnectWallet()
    const tokenContract = new ethers.Contract(tokenAddress, 
      JSON.parse(erc721), signer)



    const filterTransfer = tokenContract.filters.Transfer(null, null, ethers.BigNumber.from(tokenId))
    
    let transferItems = await tokenContract.queryFilter(filterTransfer)
    transferItems.sort((a,b) => {
              return a.blockNumber-b.blockNumber
        } 
      )


    
    const options = {
        address: tokenAddress,
        token_id: tokenId,
        chain: 'eth',
      };
    const transfersThree = await Moralis.Web3API.token.getWalletTokenIdTransfers(options);

    const transfersTwo = transfersThree['result'].reverse()


    setFinalTransfers(transfersTwo['result'])



    let items = []
    for (const i in transferItems) {
        
        // await handleTransfer(transferItems[i]["args"]["from"], transferItems[i]["args"]["to"], transferItems[i]["args"]["tokenId"])
        let item = {
          id: parseInt(i),
          blockNumber: transferItems[i]['blockNumber'],
          fromAddress: transferItems[i]["args"]["from"],
          toAddress: transferItems[i]["args"]["to"],
          tokenId
        }
        handleTransfer(parseInt(i), new Date(transfersTwo[i]['block_timestamp']), transferItems[i]["args"]["from"],transferItems[i]["args"]["to"],tokenId)
        items.push(item)
        //handleStart(item.tokenId, item.highestBid)
    }
    return items


  }



  const checkFileType = async(image) => {

    let file = fixURL(image)
  
    
    const req = await fetch(file, {method: "HEAD"})
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
    let artistPhoto
    let artistName
    let artistNametr
    if (live) { 
      artistPhoto = await fetchArtistPhoto(transfers[1].toAddress)
      artistNametr = await fetchArtistName(transfers[1].toAddress)
      artistName = editAddress(artistNametr, transfers[1].toAddress)
    } else {
      artistPhoto = await fetchArtistPhoto(transfers[0].toAddress)
      artistNametr = await fetchArtistName(transfers[0].toAddress)
      artistName = editAddress(artistNametr, transfers[0].toAddress)
    } 
    const tokenOwner = await fetchOwner()
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



 
    } else {
        ownerPhoto = await fetchArtistPhoto(transfers.slice(-1).pop().toAddress)
        ownerName = await fetchArtistName(transfers.slice(-1).pop().toAddress)
    }
    
    ownerName = editAddress(ownerName, transfers.slice(-1).pop().fromAddress)

    let imageLink;
    let isLive = false;
    for (const j in meta.data) {
      if ((meta.data[j]).toString().includes('ipfs')) {
          imageLink = meta.data[j]
      }
      if (j.includes('tier')) {
        isLive = true
      }
      
    }

    setLive(isLive)

    await checkFileType(imageLink)

    

    setNft((previousNft) =>[{
      // price: object.get("price"), 
      price: price,
      tokenId: tokenId,
      isSold: true,
      isLive: isLive,
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
      tier: meta.data.tier,
      tokenURI: tokenUri
    }]);
  };

  return (
    <>
      {isLoading ? (Array(1)
                .fill()
                .map((item, index) => {
                    return(
                        <ProductPageSkeleton key={index} />
                    )
                })) : (
        <HeaderSection>
          <ProductSection>
            <Row>
            <Col md={6}>
            <ItemInfo>
              <Card style={{ width: '600px', height: '620.17px', gap: "10px", borderRadius:'10px 10px 0 0', overflow: "hidden"}} >
                { (imageFile.toString().includes('png') || imageFile.toString().includes('gif') || imageFile.toString().includes('jpg') || 
              imageFile.toString().includes('jpeg') || imageFile.toString().includes('usemoralis')) ? (<NFTImageLarge output={nft[0].image}/>) : 
              (nft[0].coverPhotoURL) ? (<NFTAudioPlayer output={nft[0].coverPhotoURL} audio={nft[0].image}/>) : (<NFTPlayerLarge output={nft[0].image}/>) }
              <BandLayoutLarge nft={nft[0]}/>
              </Card>
            </ItemInfo>
            </Col>
            <Col md={6}>
            <NFTFullInfo>

              <TopNFTInfo>
                <NameInfo>
                  <MintedBy>
                    Minted By @{nft[0].artistName}
                  </MintedBy>
                  <NFTNameAndDate>
                    {nft[0].artistName} - {nft[0].name}
                  </NFTNameAndDate>
                </NameInfo>
                <ArtistOwnerSection>
                  <ArtistOwnerBox>
                  <ArtistOwnerSubSection>
                    {(nft[0].artistPhoto) ? (<ArtistOwnerPhoto src={nft[0].artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<ArtistOwnerPhoto src={DefaultProfilePicture} />)}
                    <ArtistOwnerSubBox>
                      <ArtistOwner>Artist</ArtistOwner>
                      <ArtistOwnerName>{nft[0].artistName}</ArtistOwnerName>
                    </ArtistOwnerSubBox>
                  </ArtistOwnerSubSection>
                  </ArtistOwnerBox>
                  <ArtistOwnerBox>
                  <ArtistOwnerSubSection>
                    {(nft[0].artistPhoto) ? (<ArtistOwnerPhoto src={nft[0].artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<ArtistOwnerPhoto src={DefaultProfilePicture} />)}
                    <ArtistOwnerSubBox>
                      <ArtistOwner>Owner</ArtistOwner>
                      <ArtistOwnerName>{nft[0].ownerName}</ArtistOwnerName>
                    </ArtistOwnerSubBox>
                  </ArtistOwnerSubSection>
                  </ArtistOwnerBox>
                </ArtistOwnerSection>
              </TopNFTInfo>
              <NFTPriceBuySection>
                <NFTListPriceInfo>
                  <NFTListPriceLabel>List Price</NFTListPriceLabel>
                  <NFTListPrice>{nft[0].price} ETH</NFTListPrice>
                </NFTListPriceInfo>
                <NFTPriceButtons>
                  <NFTBuyButton onClick={(e) => {BuyNFT(nft[0], marketAddress, marketContractABIJson); e.preventDefault();}}>
                    <NFTBuyButtonText>
                      Buy now
                    </NFTBuyButtonText>
                  </NFTBuyButton>
                  <NFTOfferButton>
                    <NFTOfferButtonText>
                      Make an Offer
                    </NFTOfferButtonText>
                  </NFTOfferButton>
                </NFTPriceButtons>
              </NFTPriceBuySection>
               <HistorySection>
                <HistoryLabel>History</HistoryLabel>
                <HistorySubSection>
                        
                        {events && events.map((event, index) => {
                          console.log(event, index, "BIGBOLD")
                          events.sort((a,b) => {
                              return a.id-b.id
                            } 
                          )
                            return (
                              <ProvenanceItem>
                            
                            {(event.fromPhoto) ? (<ProvenancePhoto src={event.fromPhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<ProvenancePhoto src={DefaultProfilePicture}/>)}
                            <ProvenanceTextBox >
                                
                                <Row>
                                  <ProvenanceUser>
                                    @{event.from}
                                  </ProvenanceUser>
                                  {(event.eventName === "Transfer") ? (
                                    <>
                                  <ProvenanceAction>
                                    transferred to @{event.to} on {event.blockNumber}
                                  </ProvenanceAction>
                                
                                  <ProvenanceUser>
                                    
                                  </ProvenanceUser>
                                  </>
                                  ) : (
                                    <>
                                  <ProvenanceAction>
                                    bought the NFT
                                  </ProvenanceAction>
                                
                                  </>
                                  )} 
                                  </Row>
                            </ProvenanceTextBox>
                            </ProvenanceItem>
                          )
                   
                        })}
                            
                        
                {/* {events && events.map((event, index) => {
                  
                  events.sort((a,b) => {
                      return a.id-b.id
                    } 
                  )
                  console.log(events, index, "CAMUS")
                  return(
                  <ProvenanceItem>
                    {(event.fromPhoto) ? (<ProvenancePhoto src={event.fromPhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<ProvenancePhoto src={DefaultProfilePicture}/>)}
                    <ProvenanceTextBox>
                      <ProvenanceText>
                        <ProvenanceUser>
                          {event.fromAddress}
                        </ProvenanceUser>
                        <ProvenanceAction>

                        </ProvenanceAction>
                        <ProvenanceDate>

                        </ProvenanceDate>
                      </ProvenanceText>
                    </ProvenanceTextBox>
                  </ProvenanceItem>
                  )
                })} */}
                  
                
                </HistorySubSection>
              </HistorySection>
            </NFTFullInfo>
            </Col>
            </Row>
            <MoreItemsSection>
              <MoreItemsText>
                More Items from the same artist
              </MoreItemsText>
              <MoreItemsRow>
                <ProductListLayout>
                    <NFTTokenIds />
                </ProductListLayout>    

              </MoreItemsRow>
            </MoreItemsSection>
           

              
            {/* <Container fluid="sm">
            
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
                        {events && events.map((event, index) => {
                          console.log(event, index, "BIGBOLD")
                          events.sort((a,b) => {
                              return a.id-b.id
                            } 
                          )
                            return (
                            <ListGroup.Item style={{fontWeight: "Bold"}}>
                            <Row>
                              <Col md={2}>
                                  {index+1}
                              </Col>
                              <Col md={4}>
                                  {event.from}
                              </Col>
                              <Col md={2}>
                                <center>
                                  -->
                                </center>
                              </Col>
                              <Col md={4}>
                                  {event.to}
                              </Col>
                            </Row>
                            </ListGroup.Item>
                          )
                   
                        })}
                            
                        </ListGroup>
                    </Col>
                    
                </Row>
            </Container> */}
          </ProductSection>
        </HeaderSection>
      )}
    </>
  );
};

export default ProductPageToken;

const ProductSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 140px;

position: absolute;
width: 1302px;
height: 1435px;
left: calc(50% - 1302px/2);
top: 150px;
`

const ItemInfo = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 60px;

width: 1302px;
height: 816px;
`

const ItemCard = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 10px;

width: 600px;
height: 620.17px;

border-radius: 10px 10px 0px 0px;
`

const CardImage = styled.img`
width: 600px;
height: 473px;
`

const NFTFullInfo = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 60px;

width: 642px;
height: 816px;
`

const TopNFTInfo = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 642px;
height: 387px;
`

const NameInfo = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 642px;
height: 304px;
`

const MintedBy = styled.div`
width: 642px;
height: 24px;

/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 24px;
/* identical to box height, or 133% */


color: #000000;
`

const NFTNameAndDate = styled.div`
width: 635px;
height: 260px;

/* highlight 1 */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 700;
font-size: 60px;
line-height: 65px;
/* or 108% */

letter-spacing: -0.03em;
text-transform: uppercase;

/* black */

color: #000000;
`

const ArtistOwnerSection = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 320px;
height: 43px;

`

const ArtistOwnerSubSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 13px;

width: 152px;
height: 43px;

`

const ArtistOwnerBox = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 152px;
height: 43px;
`

const ArtistOwnerSubBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

width: 96px;
height: 28px;
`

const ArtistOwnerPhoto = styled.img`
width: 43px;
height: 43px;

border-radius: 153px;
`

const ArtistOwner = styled.div`

width: 28px;
height: 8px;

/* caption very small */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 8px;
line-height: 8px;
/* identical to box height, or 94% */

text-transform: uppercase;

/* black */

color: #000000;
`

const ArtistOwnerName = styled.div`
width: 96px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

color: #000000;
`


const NFTPriceBuySection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 284px;
height: 144px;
`

const NFTListPriceInfo = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 4px;

width: 168px;
height: 80px;

`

const NFTListPriceLabel = styled.div`
width: 97px;
height: 27px;

/* Lead */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 20px;
line-height: 27px;
/* identical to box height */


color: #000000;
`

const NFTListPrice = styled.div`
width: 168px;
height: 49px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 40px;
line-height: 122%;
white-space: nowrap;
/* identical to box height, or 49px */


color: #000000;
`

const NFTPriceButtons = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 10px;

width: 284px;
height: 44px;

`

const NFTBuyButton  = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

width: 118px;
height: 44px;

background: #000000;
border-radius: 30px;
`

const NFTOfferButton = styled.button`
box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

width: 156px;
height: 44px;

border: 2px solid #000000;
border-radius: 30px;
`

const NFTBuyButtonText = styled.div`
width: 66px;
height: 16px;

/* button_text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 15px;
line-height: 16px;
/* identical to box height */


color: #FFFFFF;
`

const NFTOfferButtonText = styled.div`
width: 104px;
height: 16px;

/* button_text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 15px;
line-height: 16px;
/* identical to box height */


color: #000000;
`

const HistorySection = styled.div`
width: 664px;
height: 230px;
`

const HistorySubSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

position: absolute;
width: 664px;
height: 185px;
left: 660px;
top: 696px;
overflow-y: scroll;

`

const HistoryLabel = styled.div`
position: absolute;
width: 87px;
height: 15px;
left: calc(50% - 87px/2 + 58px);
top: 651px;

/* Caption */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 15px;
/* identical to box height, or 73% */

text-transform: uppercase;

color: #000000;
`

const ProvenanceItem = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 12px;

width: 1164px;
height: 49px;
`

const ProvenancePhoto = styled.img`
width: 43px;
height: 43px;

border-radius: 153px;

`

const ProvenanceTextBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 2px;

width: 909px;
height: 49px;

`

const ProvenanceText = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 5px;

position: absolute;
width: 909px;
height: 27px;
left: 0px;
top: 0px;

`

const ProvenanceUser = styled.div`


/* Lead */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 20px;
line-height: 27px;
/* identical to box height */


/* black */

color: #1E1E1E;
`

const ProvenanceAction = styled.div`


/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
/* identical to box height, or 133% */


/* black */

color: #1E1E1E;

opacity: 0.6;
`

const ProvenanceDate = styled.div`


/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 142%;
/* identical to box height, or 26px */


/* black */

color: #1E1E1E;
`


const LargeWristBand = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 30.98px;

width: 600.32px;
height: 147.17px;
`

const LargeSeal = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;

width: 600.32px;
height: 147.17px;

`

const SealImage = styled.img`
position: absolute;
left: 7.25%;
right: 21.74%;
top: 14.47%;
bottom: 14.47%;
`

const MoreItemsSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 1300px;
height: 479px;

`

const MoreItemsText = styled.div`
width: 543px;
height: 57px;

/* H5 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 50px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;

color: #000000;
`

const MoreItemsRow = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 1300px;
height: 382px;
`

const MoreItemsColumn = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 310px;
height: 382px;
`