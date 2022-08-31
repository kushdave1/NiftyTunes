import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BuyNFT } from '../nftymarketplace/BuyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function ListNFTButton({nft, handleShow, handleSellClick}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {handleShow(nft); handleSellClick(nft); e.preventDefault();}}>List</Button>
  )
}

export default ListNFTButton