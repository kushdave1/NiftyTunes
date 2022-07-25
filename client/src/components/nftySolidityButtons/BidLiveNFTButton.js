import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BidLiveNFT } from '../nftymarketplace/BidLiveNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function BidLiveNFTButton({setShow}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => setShow}>Place Bid</Button>
  )
}

export default BidLiveNFTButton