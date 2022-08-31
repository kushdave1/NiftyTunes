import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTImage({output}) {
  const { resolveLink } = useIPFS();
  const [tokenImage, setTokenImage] = useState('')

  useEffect(() => {

    if (output.includes("ipfs")) {
      setTokenImage(resolveLink(output))
    } else {
      console.log(output, "this is output")
      setTokenImage(output)
    }
    // }
    
  }, []);


  const onError = () => {
    setTokenImage(fixURL(output))
  }

  return (
    <React.Fragment>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="367.5"
              src={tokenImage}
              onError={onError}
              >
        </img>
    </React.Fragment>
  )
}

export default NFTImage