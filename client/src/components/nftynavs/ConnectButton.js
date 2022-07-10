import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'

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

// Credit Card Payment Form

import PaymentForm from '../nftylayouts/CreditCardFormLayout'
import { changeBackgroundWhite, changeBackgroundBlack } from "../nftyFunctions/hover"


function ConnectButton() {

    const {authenticate, isAuthenticated, isAuthenticating, hasAuthError, authError, user, logout, account} = useMoralis();
    const [address, setAddress] = useState('');
    const [creditCard, setCreditCard] = useState(false)

    const [name, setName] = useState()

    const [wallet, setWallet] = useState(false)

    const [show, setShow] = useState(false);
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

    if(isAuthenticating){
        return <Spinner variant="light" animation="grow" size="sm" />
                
    }


    return isAuthenticated?(
            <></>
                
    ) : (
        <>
        <Nav.Link className="text-primary" style={{fontWeight:"500"}} onClick={() => handleShow()}>Sign Up</Nav.Link> 
        <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>   
            <center>
                <div style={{paddingTop: "20px"}}>How would you like to pay for your NFTs?</div>
                <ButtonGroup style={{width: "75%", padding: "20px"}}>
                    <Button height="50px" width="50px" variant={(creditCard) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setCreditCard(true);setWallet(false);}}>Credit Card</Button>
                    <Button height="50px" width="50px" variant={(wallet) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setWallet(true);setCreditCard(false);}}>Crypto Wallet</Button>
                </ButtonGroup>
            </center>
            {creditCard && 
            <PaymentForm></PaymentForm>
            }
            {wallet && 
            <center>
            <Button className="button-hover my-3" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", 
                  borderRadius:"2.0rem", padding: "20px", width: "35%", 
                  height: "20px", lineHeight: 0 }} onClick={setWallet(false)}>Authenticate</Button>
            </center>
            }
        </Modal>
        </>
        )
}

export default ConnectButton
