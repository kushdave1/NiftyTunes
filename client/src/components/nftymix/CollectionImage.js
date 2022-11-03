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
              height="425px"
              width="425px"
              src={output}
              style={{
                  overflow: "hidden"
              }}
              >
        </img>
    </center>
  )
}

export default CollectionImage