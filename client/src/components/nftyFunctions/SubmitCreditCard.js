import React from 'react'
import {useNavigate} from 'react-router'
import Moralis from 'moralis'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BuyLazyNFT } from '../nftymarketplace/BuyLazyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function SubmitCreditCardButton({cvc, expiry, name, number}) {
    const {isAuthenticated, user} = useMoralis();

    const submitCreditInfo = async() => {
        const OffchainUsers = Moralis.Object.extend("Offchain Users")
        const offchainUser = new OffchainUsers()
        offchainUser.set(cvc, "cvc")
        offchainUser.set(name, "Name")
        offchainUser.set(expiry, "Expiration Date")
        offchainUser.set(number, "Card Number")
        await offchainUser.save()
    }

    return (
    <Button className="button-hover my-3" variant="secondary" 
                    style={{ color: "white", background: "black", pointerEvents: "auto", 
                    borderRadius:"2.0rem", float: "right", padding: "20px", width: "25%", 
                    height: "20px", lineHeight: 0 }}
                    onClick={() => submitCreditInfo()}>Submit</Button>
    )
}

export default SubmitCreditCardButton