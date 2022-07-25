import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'

function CollectionImage({output}) {

  return (
    <center>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="75"
              width="75"
              src={output}
              style={{
                  borderRadius: "5rem",
                  marginTop: "-60px"
              }}
              >
        </img>
    </center>
  )
}

export default CollectionImage