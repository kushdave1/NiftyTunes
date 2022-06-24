import React, {useState, useEffect} from 'react';
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'
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
const HeaderSection = styled.div `
    display:flex;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;


function MyWETHBalance() {
  const {isAuthenticated, user} = useMoralis();
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
  const [address, setAddress] = useState();
  const [nftData, setNftData] = useState();
  const [wethDepositAmount, setWETHDepositAmount] = useState();
  const [wethWithdrawalAmount, setWETHWithdrawalAmount] = useState();
  const [nfts, setNFTs] = useState([]);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, marketContractABI, wethAddress, wethContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const marketContractABIJson = JSON.parse(marketContractABI);
  const wethContractABIJson = JSON.parse(wethContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ListedNFTs");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  


  // const { fetchERC20Balances, data, error, isLoading, isFetching } = useERC20Balances();

  useEffect(() => {
        if(!user) return null
        setAddress(user.get('ethAddress'))
    }, [user]);

  const getWETHBalance = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const wethContract = new ethers.Contract(wethAddress, wethContractABIJson, signer)
    let signerAddress = signer.getAddress()

    let balance = await wethContract.balanceOf(signerAddress)
    console.log(ethers.utils.formatEther( balance ))

  }

  const getWETHAllowance = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const marketContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)
    let signerAddress = signer.getAddress()

    let balance = await marketContract.getAllowance()
    console.log(ethers.utils.formatEther( balance ))

  }

  const depositWETH = async(wethTotal) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const wethContract = new ethers.Contract(wethAddress, wethContractABIJson, signer)
    let signerAddress = signer.getAddress()

    const totalInWei = ethers.utils.parseUnits(
      (parseFloat(wethTotal)).toString(),
      'ether',
      decimalPlaces
    );

    let transaction = await wethContract.mint({value: totalInWei})
    await transaction.wait()
    console.log('success for sure')

  }

  const withdrawWETH = async(wethTotal) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const wethContract = new ethers.Contract(wethAddress, wethContractABIJson, signer)
    let signerAddress = signer.getAddress()

    const totalInWei = ethers.utils.parseUnits(
      (parseFloat(wethTotal)).toString(),
      'ether',
      decimalPlaces
    );

    let transaction = await wethContract.burn(totalInWei)
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
    
    <HeaderSection>
      <Container className='d-flex flex-column col-xl-12 align-items-stretch'>
        <Row className='mt-auto'>
          <Col lg={4} md={6}> 
            <Form>
              <Form.Group className="mb-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Deposit Amount"
                  className="mb-3"
                >
                <Form.Control 
                  type="input"
                  placeholder= 'How much WETH would you like to add'
                  onChange={e => setWETHDepositAmount(e.target.value)}/>
                </FloatingLabel>
              </Form.Group>
            </Form>
            <Button onClick={() => depositWETH(wethDepositAmount)}>Deposit</Button>
          </Col>
        </Row>
        <Col xs={12} lg={3}> 
          <Row className='mt-auto'>
            <Button onClick={() => getWETHBalance()}>Get current Balance</Button>
          </Row>
          <Row className='mt-auto'>
            <Button onClick={() => getWETHAllowance()}>Get current Allowance</Button>
          </Row>
        </Col>
        <Row className='mt-auto'>
          <Col xs={12} lg={3} > 
            <Form>
              <Form.Group className="mb-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Withdraw Amount"
                  className="mb-3"
                >
                <Form.Control 
                  type="input"
                  placeholder= 'How much WETH would you like to withdraw'
                  onChange={e => setWETHWithdrawalAmount(e.target.value)}/>
                </FloatingLabel>
              </Form.Group>
            </Form>
            <Button onClick={() => withdrawWETH(wethWithdrawalAmount)}>Withdraw</Button>
          </Col>
        </Row>
    </Container>
  </HeaderSection>
    
  );
}

export default MyWETHBalance;

