import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'
import styled from 'styled-components'
import { useMoralis } from 'react-moralis'
import Moralis from 'moralis'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import { useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";

import { ConnectWallet } from "../nftyFunctions/ConnectWallet"

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { Tooltip, Spin, Input } from "antd";
import { Modal as antdModal } from 'antd';
import Vector23 from '../../assets/images/Vector 23.png'

// user auth offchain form

// Credit Card Payment Form

// import PaymentForm from '../nftylayouts/CreditCardFormLayout'
import { changeBackgroundWhite, changeBackgroundBlack } from "../nftyFunctions/hover"

const NavButton = styled.button`
/* button */


/* Auto layout */

display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

position: absolute;
width: 168px;
right: 41px;
top: 17.14%;
bottom: 20%;
font-size: 14px;

background: #FFFFFF;
border-radius: 30px;
`

const ConnectWalletButton = styled.button`
    /* button */


    /* Auto layout */

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;
    color: white;

    position: absolute;
    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    width: 167px;
    height: 44px;
    left: 30%;
    top: 305px;

    background: #000000;
    border-radius: 30px;
`

const ConnectMetamaskButton = styled.button`
    /* button */


    /* Auto layout */

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;
    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: white;

    position: absolute;
    width: 131px;
    height: 44px;
    left: 55%;
    top: 305px;

    background: #000000;
    border-radius: 30px;
`


function ConnectButton() {

    const {authenticate, isAuthenticated, isAuthenticating, hasAuthError, authError, user, logout, account} = useMoralis();
    const [address, setAddress] = useState('');
    const [creditCard, setCreditCard] = useState(false)
    

    const { chainId, marketAddress, marketContractABI, nftyLazyFactoryAddress, nftyLazyContractABI } = useMoralisDapp();
    const nftyLazyContractABIJson = JSON.parse(nftyLazyContractABI)
    const marketContractABIJson = JSON.parse(marketContractABI);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const [wallet, setWallet] = useState(false)
    const [userAuth, setUserAuth] = useState(false)

    const [show, setShow] = useState(false);
    const [minterShow, setMinterShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    let navigate = useNavigate();
    

    useEffect(() => {
        console.log(isAuthenticated, 'ajdal')
        if(!user) return null;
        setAddress(user.get('ethAddress'));
    }, [user]);


    async function handleConnect(){
        await authenticate({
            onSuccess: () => navigate('/profile'),
            onError: () => console.log(authError)
        })
    }

    async function handleWalletConnect(){
        await authenticate({
            provider: "walletconnect",
            onSuccess: () => navigate('/profile'),
            onError: () => console.log(authError)
        })
    }

    const SignUpUser = async() => {

        const signer = await ConnectWallet()
        const signerAddress = signer.address
        const marketContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)
        const nftyLazyContract = new ethers.Contract(nftyLazyFactoryAddress, nftyLazyContractABIJson, signer)

        const signerRole = utils.keccak256(utils.toUtf8Bytes("SIGNER_ROLE"))

        let isRole = await nftyLazyContract.hasRole(signerRole, signerAddress)
        console.log(isRole)
        if (isRole) {
            console.log("Already signed in with Role")
        } else {

            let transaction = await marketContract.setSignerRole(nftyLazyFactoryAddress)
            transaction.wait()
            console.log('success for sure')
        }

        
    }

    

    // const handleCustomLogin = async () => {
    //         authenticate({
    //             provider: "web3Auth",
    //             clientId: "BD0o872HKD-qXXgcIrokQv-s2VfFmDw4bfwOkRUP2jYjcZWCDDFyvHao8bVOQpa6aodJDw93pCm8ufGCE4WuTxo",
    //             chainId: "0x4"
    //         })
    //             .then(function (user) {
    //             console.log(user.get("ethAddress"), "this is the address");
    //             })
    //             .catch(function (error) {
    //             console.log(error, "this is the error");
    //             });
    //     };

    
    if(isAuthenticating){
        return <Spinner variant="light" animation="grow" size="sm" />
                
    }

    const XFull = () => {
        return (
            <div style={{cursor: "pointer"}} onClick={()=>handleClose()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }


    return isAuthenticated?(
            <></>
                
    ) : (
        <>
        <NavButton onClick={() => handleShow()}>Connect wallet</NavButton> 
        <Modal show={show} onHide={handleClose} fullscreen={true} >  
            <XFull/>
            <ModalContent>
                <WalletTitle>Welcome! <br/> Connect Your Wallet!</WalletTitle>
                <PayForNFTs>How would you like to pay for your NFTs?</PayForNFTs>
                <ConnectWalletButton onClick={()=>handleWalletConnect()}>Wallet Connect</ConnectWalletButton>
                <ConnectMetamaskButton onClick={()=>handleConnect()}>Metamask</ConnectMetamaskButton>
            </ModalContent>
        </Modal>
        </>
        )
}

export default ConnectButton

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 40px;

    position: absolute;
    width: 50%;
    height: 35%;
    left: 367px;
    top: 176px;
`

const XButton = styled.img`
    position: absolute;
    width: 24px;
    height: 24px;
    right: 24px;
    top: 24px;
`

const XButton2 = styled.img`
    position: absolute;
    width: 24px;
    height: 24px;
    right: 24px;
    top: 24px;
    transform: rotate(-90deg);
`


const WalletTitle = styled.div`
    width: 686px;
    height: 208px;

    /* H2 */

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 900;
    font-size: 100px;
    line-height: 104px;
    /* or 95% */

    text-align: center;
    text-transform: uppercase;

    color: #000000;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
`


const PayForNFTs = styled.div`
    /* How would you like to pay for your NFTs? */


    width: 430px;
    height: 27px;

    /* Lead */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 27px;
    /* identical to box height */

    text-align: center;

    color: #000000;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
`