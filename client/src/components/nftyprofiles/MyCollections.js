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

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { MerkleTree } from 'merkletreejs';


const { Meta } = Card;

const decimalPlaces = 5;

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


function MyCollections() {
  const {isAuthenticated, user} = useMoralis();
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
  const [address, setAddress] = useState();
  const [nftData, setNftData] = useState();
  const [mintAmount, setMintAmount] = useState();
  const [nfts, setNFTs] = useState([]);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, collectionAddress, collectionContractABI, wethAddress, wethContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const collectionContractABIJson = JSON.parse(collectionContractABI);
  const wethContractABIJson = JSON.parse(wethContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ItemImages");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  


  // const { fetchERC20Balances, data, error, isLoading, isFetching } = useERC20Balances();

  useEffect(() => {
        if(!user) return null
        setAddress(user.get('ethAddress'))
    }, [user]);


  const safeMint = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)
    let signerAddress = signer.getAddress()

    let mintPrice = 0.005*mintAmount
    const totalInWei = ethers.utils.parseUnits(
      (parseFloat(mintPrice)).toString(),
      'ether',
      decimalPlaces
    );
    let transaction = await collectionContract.mint(signerAddress, mintAmount, {value: totalInWei} )
    await transaction.wait()
    console.log('success for sure')

  }

  const whitelistMint = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)
    

    let mintPrice = 0.05*mintAmount
    const totalInWei = ethers.utils.parseUnits(
      (parseFloat(mintPrice)).toString(),
      'ether',
      decimalPlaces
    );

    let whitelistAddresses = [
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" // The address in remix
    ];

    const buf2hex = (x) => {
      const hex = '0x' + x.toString('hex');
      return hex;
    }

    let signerAddress = await signer.getAddress()

    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const leaf = keccak256(signerAddress);
    console.log(leaf);
    const proof = merkleTree.getProof(leaf).map(x => buf2hex(x.data));
    console.log(proof)
    

    let transaction = await collectionContract.whitelistMint(proof, signerAddress, mintAmount, {value: totalInWei})
    await transaction.wait()
    console.log('success for sure')

  }







  function succList() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT was listed on the marketplace`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approval is now set, you may list your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToSend.image);
    itemImage.set("nftContract", nftToSend.token_address);
    itemImage.set("tokenId", nftToSend.token_id);
    itemImage.set("name", nftToSend.name);

    itemImage.save();
  }
    





  return (
    
    <Container>
      <Row xs={1} md={4} className="g-4 d-flex justify-content-center">
        <div>
          <Form>
            <Form.Group className="mb-3">
              <FloatingLabel
                controlId="floatingInput"
                label="Mint Amount"
                className="mb-3"
              >
              <Form.Control 
                type="input"
                placeholder= 'How many would you like to mint'
                onChange={e => setMintAmount(e.target.value)}/>
              </FloatingLabel>
            </Form.Group>
          </Form>
          <Button onClick={() => safeMint()}>Mint</Button>
        </div>
      </Row>
    </Container>
    
  );
}

export default MyCollections;

