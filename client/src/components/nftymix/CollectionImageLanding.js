import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'

function CollectionImage({output, height}) {

  return (
    <center>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height={height}
              src={output}
              style={{
                  borderRadius: "1rem",
                  marginTop: "20px"
              }}
              >
        </img>
    </center>
  )
}

export default CollectionImage