import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { StartAuction } from '../nftymarketplace/StartAuction'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function StartAuctionButton({setShowStartModal}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {
                    //   StartAuction(); 
                  setShowStartModal(true);
                  e.preventDefault();
                  }}
                  >Start Auction</Button>
  )
}

export default StartAuctionButton