import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTImage({output}) {
  const { resolveLink } = useIPFS();
  const [tokenImage, setTokenImage] = useState('')

  useEffect(() => {
    setTokenImage(resolveLink(output))
  }, []);

  const fixURL = (url) => {
        if(url.startsWith("ipfs")){
        return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
        }
        else {
        return url+"?format=json"
        }
    };
  const fixImageURL = (url) => {
      if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
      }
      else {
      return url+"?format=json"
      }
  };

  const onError = () => {
    setTokenImage(fixURL(output))
  }

  return (
    <React.Fragment>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="400"
              src={tokenImage}
              onError={onError}
              >
        </img>
    </React.Fragment>
  )
}

export default NFTImage