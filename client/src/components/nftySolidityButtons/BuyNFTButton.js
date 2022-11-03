import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { BuyNFT } from '../nftymarketplace/BuyNFT'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function BuyNFTButton({nft, marketAddress, marketContractABIJson}) {
  return (
    <button 
                  onClick={(e) => {BuyNFT(nft, marketAddress, marketContractABIJson); e.preventDefault();}}/>
  )
}

export default BuyNFTButton