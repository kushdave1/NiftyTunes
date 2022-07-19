import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTImageSmall({output}) {
  const { resolveLink } = useIPFS();
  const [tokenImage, setTokenImage] = useState('')

  useEffect(() => {
    setTokenImage(resolveLink(output))
  }, []);


  const onError = () => {
    try {
      setTokenImage(fixURL(output))
    } catch {
      setTokenImage(fixImageURL())
    }
  }

  return (
    <React.Fragment>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="300"
              src={tokenImage}
              onError={onError}
              >
        </img>
    </React.Fragment>
  )
}

export default NFTImageSmall