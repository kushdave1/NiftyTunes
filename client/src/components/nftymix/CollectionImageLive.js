import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'

function CollectionImageLive({output}) {

  return (
    <center>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="420px"
              width="640px"
              src={output}
              style={{
                  overflow: "hidden"
              }}
              >
        </img>
    </center>
  )
}

export default CollectionImageLive