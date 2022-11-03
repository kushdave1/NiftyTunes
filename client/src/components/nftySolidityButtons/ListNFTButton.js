import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BuyNFT } from '../nftymarketplace/BuyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function ListNFTButton({nft, handleShow, handleSellClick}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "black", background: "#F6A2B1", pointerEvents: "auto", borderRadius:"2.0rem", alignItems: "center" }}
                  onClick={(e) => {handleShow(nft); handleSellClick(nft); e.preventDefault();}}>List Item</Button>
  )
}

export default ListNFTButton