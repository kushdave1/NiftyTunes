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
import ProductCardsLayoutMyNFTs from '../nftylayouts/ProductCardsLayoutMyNFTs'
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
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
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
  const handleShow = () => setShow(true);

  useEffect(() => {
        if(!user) return null
        setAddress(user.get('ethAddress'));
        
        getNFT();
 
        NFTBalances();
      
        setTimeout(() => {
          setLoading(false)
        }, 1000);
        console.log(nfts)
    }, [user]);

  
  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };


  const NFTBalances = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)

    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)

    const data = await storageContract.fetchMyNFTs()
    let image = ''
    let imageLink = ''

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
            image = resolveLink(meta.data[j])
        }
      }
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI,
        tokenAddress: i.tokenAddress
      }
      return item
    }))
    setNFTs(items)
    console.log(items);
    setLoading(true) 
  }


  const getNFT = async() => {
        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const network = await provider.getNetwork(); 
        const name = network.name;
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress();

        try {
          await getNFTBalances({ params: { chain: name } })
        } catch {
          return;
        }

        const dataMarkets = await getNFTBalances({ params: { chain: name } })
        const results = dataMarkets.result
        const items = []
        let image = ''
        let imageBon = ''
        let imageLink = ''
        //let meta = ''
      
        for (const i in results) {
          
            const object = results[i];
            if (object?.token_uri) {
              
              let meta = await axios.get(fixURL(object.token_uri))
              for (const j in meta.data) {
                  if ((meta.data[j]).toString().includes('ipfs')) {
                      imageLink = meta.data[j]
                      image = resolveLink(meta.data[j])
                  }
              }
              let item = {
                  name: meta.data['name'],
                  description: meta.data['description'],
                  image: imageLink,
                  owner: object.owner_of,
                  tokenId: object.token_id,
                  tokenAddress: object.token_address
              }
              if (nfts.includes(item) === false) {
                setNFTs((previousNft) => [...previousNft, {
                    name: meta.data['name'],
                    description: meta.data['description'],
                    image: imageLink,
                    owner: object.owner_of,
                    tokenId: object.token_id,
                    tokenAddress: object.token_address
                }])}
            }      
        }
      
    }




  const ListNFT = async(nft, listPrice) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const price = ethers.utils.parseUnits(listPrice, 'ether')
    
    const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)
    console.log(nft.tokenId, nft.tokenAddress)

    let transaction = await marketplaceContract.resellToken(nft.tokenId, price, nft.tokenAddress)
    await transaction.wait()
    console.log('success for sure')

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
                    <ProductCardsLayoutMyNFTs id={index} key={index} lazy={nft.lazy} tokenAddress={nft.tokenAddress} voucher={nft.voucher} gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} owner={nft.owner} description={nft.description} tokenId={nft.tokenId} price={nft.price} handleShow={handleShow} handleSellClick={handleSellClick}/>
                    </Col>

                  )}}
              ))
              }
      </React.Fragment>
    </ProductListLayout>
    <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Input
              autoFocus
              placeholder="Listing Price in ETH"
              onChange={(e) => setPrice(e.target.value)}
            />
            <Button variant = 'primary' onClick={() => ListNFT(nftToSend, price)}>List</Button>
            
          </Modal>
  </MarketPlaceSection>
          
       
    
  );
}

export default MyNFTs;

