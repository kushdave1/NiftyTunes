import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'
import Moralis from 'moralis'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import { useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";

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

// user auth offchain form

// Credit Card Payment Form

// import PaymentForm from '../nftylayouts/CreditCardFormLayout'
import { changeBackgroundWhite, changeBackgroundBlack } from "../nftyFunctions/hover"


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
        if(!user) return null;
        setAddress(user.get('ethAddress'));
    }, [user]);


    async function handleConnect(){
        await authenticate({
            onSuccess: () => navigate('/profile'),
            onError: () => console.log(authError)
        })
    }

    const SignUpUser = async() => {

        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const signerAddress = signer.getAddress()
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

    

    const handleCustomLogin = async () => {
            authenticate({
                provider: "web3Auth",
                clientId: "BD0o872HKD-qXXgcIrokQv-s2VfFmDw4bfwOkRUP2jYjcZWCDDFyvHao8bVOQpa6aodJDw93pCm8ufGCE4WuTxo",
                chainId: "0x4"
            })
                .then(function (user) {
                console.log(user.get("ethAddress"), "this is the address");
                })
                .catch(function (error) {
                console.log(error, "this is the error");
                });
        };

    
    if(isAuthenticating){
        return <Spinner variant="light" animation="grow" size="sm" />
                
    }


    return isAuthenticated?(
            <></>
                
    ) : (
        <>
        <Nav.Link className="text-primary" style={{fontWeight:"500", paddingLeft: "250px"}} onClick={() => handleShow()}>Connect Wallet</Nav.Link> 
        <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >  
            <center>
                <div style={{paddingTop: "20px"}}>How would you like to pay for your NFTs?</div>
                <ButtonGroup style={{width: "75%", padding: "20px"}}>
                    <Button height="50px" width="50px" variant={(userAuth) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setUserAuth(true);setWallet(false);}}>Credit Card</Button>
                    <Button height="50px" width="50px" variant={(wallet) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setWallet(true);setUserAuth(false);}}>Crypto Wallet</Button>
                </ButtonGroup>
            </center>
            {userAuth && 
            <Form className="py-1 px-3">
                <Form.Group className="mb-1" controlId="username">
                    <Form.Label style={{fontSize: 10, marginBottom: "-10px"}}>Email</Form.Label>
                    <Form.Control 
                    type="tel" 
                    name="email"
                    placeholder="Enter Email" 
                    onChange={(e)=>setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Button className="button-hover my-3" variant="secondary" 
                            style={{ color: "white", background: "black", pointerEvents: "auto", 
                            borderRadius:"2.0rem", float: "right", padding: "20px", width: "25%", 
                            height: "20px", lineHeight: 0 }}
                            onClick={handleCustomLogin}>Submit</Button>
            </Form>
            }
            {/* {creditCard && 
            <PaymentForm></PaymentForm>
            } */}
            {wallet && 
            <center>
            <Button className="button-hover my-3" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", 
                  borderRadius:"2.0rem", padding: "20px", width: "35%", 
                  height: "20px", lineHeight: 0 }} onClick={()=>handleConnect()}>Authenticate</Button>
            </center>
            }
        </Modal>
        </>
        )
}

export default ConnectButton
