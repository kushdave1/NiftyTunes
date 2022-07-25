import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'
import { StartAuction } from '../nftymarketplace/StartAuction'
import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

function UploadMetadataButton({setMetaModalShow, metaModalShow}) {
  return (
    <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {setMetaModalShow(true); e.preventDefault();console.log(metaModalShow)}}>📁 Metadata</Button>
  )
}

export default UploadMetadataButton