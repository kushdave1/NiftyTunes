import React, {useState, useEffect} from 'react';
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis"
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
import Moralis from 'moralis'
import $ from "jquery"
import { useNFTBalance } from "../../hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Tooltip, Spin, Input } from "antd";
import { useIPFS } from "hooks/useIPFS";

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { useMoralisWeb3Api } from "react-moralis";

import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { fetchListedIds } from '../nftyFunctions/FetchTokenIds'

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


function MyListedNFTs() {

  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
  const [address, setAddress] = useState();
  const [nftData, setNftData] = useState();
  const [nfts, setNFTs] = useState([]);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, marketContractABI,storageAddress, storageContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ListedNFTs");
  const storageContractABIJson = JSON.parse(storageContractABI);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };


  // const { fetchERC20Balances, data, error, isLoading, isFetching } = useERC20Balances();

  useEffect(async() => {
        if(!user) return null
        setAddress(user.get('ethAddress'));
        const tokenIds = await fetchListedIds(marketAddress, marketContractABI,storageAddress, storageContractABI);
        setNFTs(tokenIds)
        setTimeout(() => {
          setLoading(false)
        }, 1000);
    }, [user]);


  const deListNFT = async(nft) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    let transaction = await marketplaceContract.delistToken(nft.tokenId)

    await transaction.wait() 
    console.log('success for sure')

  }


  const acceptBid = async(nft) =>  {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(marketAddress, contractABIJson, signer)

    let transaction = await marketContract.acceptBid(nft.tokenId)
    transaction.wait();
  }  


  return (
    
    <MarketPlaceSection className="d-flex justify-content-center">
    <Row>
      <React.Fragment>
              {loading?
                  //render skeleton when loading
                (Array(6)
                .fill()
                .map((item, index) => {
                    return(
                        <ProductSkeleton key={index} />
                    )
                  })) : (
                nfts && nfts.map((nft, index) => {
                  if (nft.name !== "") { 
                    return(
                    <Col>
                    <ProductCardsLayoutLazy pageFrom="MyListedNFTs" key={index} owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} price={nft.price}
                    handleShow={handleShow} handleSellClick={handleSellClick} coverPhotoURL={nft.coverPhotoURL}/>
                    </Col>

                  )}}
              ))
              }
      </React.Fragment>
    </Row>
    <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Button variant = 'primary' onClick={() => deListNFT(nftToSend)}>DeList</Button>
            
          </Modal>
  </MarketPlaceSection>
    
  );
}

export default MyListedNFTs;
