import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BuyLazyNFT } from '../nftymarketplace/BuyLazyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function BuyLazyNFTButton({nft, nftyLazyFactoryAddress}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {BuyLazyNFT(nft, nftyLazyFactoryAddress); e.preventDefault();}}>Buy</Button>
  )
}

export default BuyLazyNFTButton