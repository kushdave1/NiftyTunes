import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BuyNFT } from '../nftymarketplace/BuyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function BuyNFTButton({nft, marketAddress, marketContractABIJson}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {BuyNFT(nft, marketAddress, marketContractABIJson); e.preventDefault();}}>Buy</Button>
  )
}

export default BuyNFTButton