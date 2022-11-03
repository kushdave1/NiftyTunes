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
import {useParams} from 'react-router'

import checkmark from "../../assets/images/checkmark.png"
import error from "../../assets/images/error.png"

import { checkFileType } from "../nftyFunctions/checkFileType"

import LiveMintFactory from '../../contracts/LiveMint.sol/LiveMintFactory.json';

import Moralis from 'moralis'
import { useMoralisQuery } from 'react-moralis'

import { useNFTBalance } from "../../hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Tooltip, Spin, Input } from "antd";
import { useIPFS } from "hooks/useIPFS";
import { GetProvider } from '../nftyFunctions/GetProvider'

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
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"
import { FetchLiveTokenURI, FetchLiveOwner, FetchAuctionId } from '../nftyFunctions/FetchLiveTokenIds'

import ProductCardsLayoutLive from "components/nftylayouts/ProductCardsLayoutLive";
import ProductCardsLayoutLiveMobile from "components/nftylayouts/ProductCardsLayoutLiveMobile";


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



function ArtistItems() {
  const { resolveLink } = useIPFS();
  const { ethAddress } = useParams();
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

  const [width, setWindowWidth] = useState()
  const [approveLoading, setApproveLoading] = useState(false)
  const [approveSuccess, setApproveSuccess] = useState(false)
  const [approveError, setApproveError] = useState(false)
  const [approvedStatus, setApprovedStatus] = useState(false)
  let navigate = useNavigate();

  useEffect(async() => {

        console.log(ethAddress, "SKA")

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

        getArtistNFTs();
 
        setTimeout(() => {
          setLoading(false)
        }, 1000);
        
    }, []);

  const {fetch} = useMoralisQuery(
        "LiveMintedCollections",
        (query) => query.equalTo("signerAddress", ethAddress),
        [],
        { autoFetch: false }
    );

  

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

  const retreiveNFTData = async(data,coverArt,collectionName,collectionDescription) => {

      let signer
      let liveMintFactory
      let liveMintFactoryContract
      let tokenURI
      let location
      let date
      let owner
      let ownerName
      let ownerPhoto
      let artistPhoto
      let artistName
      let fileTypeFinal
      let name
      let description
      let sold
      let tier
      let imageLink
      let items = []

      for (const n in data) {
            if (isAuthenticated) {
                signer = await ConnectWallet()
                liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
                liveMintFactoryContract = liveMintFactory.attach(data[n].mintAddress);
            } else {
                signer = GetProvider()
                liveMintFactoryContract = new ethers.Contract(data[n].mintAddress, LiveMintFactory.abi, signer)
            }

          for (let m = 0; m < data[n].totalNFTs; m++) {
                try {
                    tokenURI = await FetchLiveTokenURI( data[n].mintAddress, data[n].totalNFTs, m, coverArt, isAuthenticated )
                } catch (error) {
                    console.log(error)
                }
                tier = data[n].tier

                if (tokenURI !== "") {
                    const meta = await axios.get(fixURL(tokenURI))
                    for (const k in meta.data) {
                        if ((meta.data[k]).toString().includes('ipfs')) {
                            imageLink = meta.data[k]
                        }
                    }
                    location = meta.data.location
                    date = meta.data.date
                    fileTypeFinal = await checkFileType(imageLink)
                    console.log(fileTypeFinal, "SLA")
                    name = meta.data.name
                    description = meta.data.description
                    sold = true

                    try {
                    console.log(m, "this is the tokenId")
                    owner = await liveMintFactoryContract.ownerOf(m)
                    
                } catch {
                    owner = ""
                }

                ownerName = await fetchArtistName(owner)
                ownerPhoto = await fetchArtistPhoto(owner)
                artistName = await fetchArtistName(ethAddress)
                artistPhoto = await fetchArtistPhoto(ethAddress)
            } else {
                name = collectionName.concat(` #${m+1}`)
                description = collectionDescription
                imageLink = coverArt
                sold = false
                date = ""
                location = "NftyTunes"
                owner = ""
                ownerName=""
                ownerPhoto=""
                fileTypeFinal="png"
                artistName = await fetchArtistName(ethAddress)
                artistPhoto = await fetchArtistPhoto(ethAddress)
                

            }

            items.push(
              {
                  tokenId: m,
                  name: name,
                  image: imageLink,
                  description: description,
                  artistName: artistName,
                  artistPhoto: artistPhoto,
                  coverArt: imageLink,
                  sold: sold,
                  owner: owner,
                  ownerName: ownerName,
                  ownerPhoto: ownerPhoto,
                  fileType: fileTypeFinal,
                  tier: tier,
                  date: date,
                  location: location

            }
            )



            setNFTs(previousNFTs => [...previousNFTs, {
                  tokenId: m,
                  name: name,
                  image: imageLink,
                  description: description,
                  artistName: artistName,
                  artistPhoto: artistPhoto,
                  coverArt: imageLink,
                  sold: sold,
                  owner: owner,
                  ownerName: ownerName,
                  ownerPhoto: ownerPhoto,
                  fileType: fileTypeFinal,
                  tier: tier,
                  date: date,
                  location: location

            }])
                }
            }
        }
  





  const getArtistNFTs = async() => {

    let signer
    let liveMintFactory
    let liveMintFactoryContract
    let items = []

    const results = await fetch()

    let object
    let data
    let coverArt
    let name   
    let description
    

    for (const j in results) {

        object = results[j]
        data = object.get("auctionData")
        coverArt = object.get("CoverArtURL")
        name = object.get("CollectionName")
        description = object.get("description")

        const items = retreiveNFTData(data, coverArt, name, description) 



    }
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
      
                    <ProductCardsLayoutLive pageFrom="MyNFTs" key={index} owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} price={nft.price} 
                    tokenAddress={nft.tokenAddress} tokenId={nft.tokenId} fileType={nft.fileType} nftFrom="Artist"
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
      
    <div style={{display: "flex", top: "100px", left: "calc(50% - 322px/2 - 5px)", position: "absolute"}}>
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
      
                    <ProductCardsLayoutLiveMobile pageFrom="MyNFTs" key={index} owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} price={nft.price} 
                    tokenAddress={nft.tokenAddress} tokenId={nft.tokenId} fileType={nft.fileType} nftFrom="Artist"
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
    
    
    </>
       
    
  );
}

export default ArtistItems;

const MarketContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 40px;

    position: absolute;
    width: 1300px;
    min-height: 848px;
    left: calc(50% - 1300px/2);
    top: 610px;
    overflow-x: hidden;


`

const MarketRow = styled.div`

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    width: 1300px;
    height: 382px;
    background: #F6A2B1;
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