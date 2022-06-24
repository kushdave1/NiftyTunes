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

import ProductSkeleton from '../nftyloader/ProductSkeleton'
import ProductCardsLayoutMyListedNFTs from '../nftylayouts/ProductCardsLayoutMyListedNFTs'
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

  useEffect(() => {
        if(!user) return null
        setAddress(user.get('ethAddress'));
        NFTBalancesListed();
        setTimeout(() => {
          setLoading(false)
        }, 1000);
    }, [user]);
  

  const NFTBalancesListed = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const signerAddress = await signer.getAddress();
    console.log(signerAddress)
    const ItemImage = await Moralis.Object.extend("ListedNFTs");

    const query = new Moralis.Query(ItemImage);

    let image = ''
    let imageLink = ''

    query.equalTo("signerAddress", signerAddress);
    const data = await query.find();
    console.log(data.length)
    const items = []
    for (let i = 0; i < data.length; i++) {
      const object = data[i];
      console.log(object)
      const meta = await axios.get(fixURL(object.get("tokenURI")))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
            image = resolveLink(meta.data[j])
        }
      }
      let item = {
        price: object.get("price"), 
        tokenId: object.get("tokenId"),
        owner: object.get("signerAddress"),
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI: object.get("tokenURI"),
        isSold: object.get("isSold")
      }
      console.log(item.isSold)
      if (item.isSold === false) {
        console.log(item)
        items.push(item);
      }
    }

    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)

    const dataFromContract = await storageContract.fetchItemsListed(signerAddress)
    

    const itemsContract = await Promise.all(dataFromContract.map(async i => {
      console.log(i.tokenId.toNumber(), i.seller)
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
            image = resolveLink(meta.data[j])
        }
      }
      
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let highestBid = ethers.utils.formatUnits(i.highestBid.toString(), 'ether')

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI,
        highestBid,
      }
      
      items.push(item)
    }))
    setNFTs(items);
  }


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
    <ProductListLayout>
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
                    <ProductCardsLayoutMyListedNFTs id={index} key={index} lazy={nft.lazy} tokenAddress={nft.tokenAddress} voucher={nft.voucher} gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} owner={nft.owner} description={nft.description} tokenId={nft.tokenId} price={nft.price} handleShow={handleShow} handleSellClick={handleSellClick}/>
                    </Col>

                  )}}
              ))
              }
      </React.Fragment>
    </ProductListLayout>
    <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Button variant = 'primary' onClick={() => deListNFT(nftToSend)}>DeList</Button>
            
          </Modal>
  </MarketPlaceSection>
    
  );
}

export default MyListedNFTs;
