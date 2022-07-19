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
import nftyimg from '../../assets/images/NT_White_Isotype.png'

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { useMoralisWeb3Api } from "react-moralis";

import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
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

  useEffect(async() => {
        if(!user) return null
        setAddress(user.get('ethAddress'));

        getNFT();

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


  const getNFT = async() => {
        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const network = await provider.getNetwork(); 
        const name = network.name;
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
                      console.log(imageLink)
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
  
  const ApproveNFT = async(nft) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)
    let transactionApprove = await marketplaceContract.approve(marketAddress, nft.tokenId)
    await transactionApprove.wait()
    console.log('success for sure')
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
     
                    <ProductCardsLayoutLazy pageFrom="MyNFTs" key={index} owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} price={nft.price} 
                    handleShow={handleShow} handleSellClick={handleSellClick}/>
   

                  )}}
              ))
              }
      </React.Fragment>
    </ProductListLayout>
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
                <Button variant = 'dark' style={{borderRadius: "2rem", marginTop: "5px"}} onClick={() => ApproveNFT(nftToSend)}>Approve</Button>
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
                <Button variant = 'dark' style={{borderRadius: "2rem", float: "right"}} onClick={() => ListNFT(nftToSend, price)}>List your NFT!</Button>
               
            </Form.Group>
            
        </Form>
    </Modal>
  </MarketPlaceSection>
          
       
    
  );
}

export default MyNFTs;

