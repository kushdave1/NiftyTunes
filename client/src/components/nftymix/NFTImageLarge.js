import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTImageLarge({output}) {
  const { resolveLink } = useIPFS();
  const [tokenImage, setTokenImage] = useState('')

  useEffect(() => {
    setTokenImage(resolveLink(output))
  }, []);


  const onError = () => {
    try {
      setTokenImage(fixURL(output))
    } catch {
      setTokenImage(fixImageURL(output))
    }
  }

  return (
    <React.Fragment>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="600"
              src={tokenImage}
              onError={onError}
              >
        </img>
    </React.Fragment>
  )
}

export default NFTImageLarge