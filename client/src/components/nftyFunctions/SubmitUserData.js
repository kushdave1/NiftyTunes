import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import Moralis from 'moralis'

import { useMoralis } from 'react-moralis'

//Bootstrap
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { BuyLazyNFT } from '../nftymarketplace/BuyLazyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function SubmitUserData() {
    // const {isAuthenticated, user} = useMoralis();
    const [email, setEmail] = useState('')
    const [password, setPassword]  = useState('')


    return (
    <>
    <Form className="py-1 px-3">
        <Form.Group className="mb-1" controlId="username">
            <Form.Label style={{fontSize: 10, marginBottom: "-10px"}}>Email</Form.Label>
            <Form.Control 
            type="tel" 
            name="email"
            placeholder="Enter Username" 
            onChange={(e)=>setEmail(e.target.value)}/>
            <Form.Text className="text-muted">
            </Form.Text>
        </Form.Group>
        <Button className="button-hover my-3" variant="secondary" 
                    style={{ color: "white", background: "black", pointerEvents: "auto", 
                    borderRadius:"2.0rem", float: "right", padding: "20px", width: "25%", 
                    height: "20px", lineHeight: 0 }}
                    >Submit</Button>
    </Form>
    
    </>
    )
}

export default SubmitUserData