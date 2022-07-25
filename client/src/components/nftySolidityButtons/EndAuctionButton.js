import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { EndAuction } from '../nftymarketplace/EndAuction'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function EndAuctionButton({withdraw}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {withdraw(); e.preventDefault();}}>Withdraw</Button>
  )
}

export default EndAuctionButton