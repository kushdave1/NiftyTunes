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

    if (output.includes("ipfs") && !UrlExists(output)) {
      setTokenImage(resolveLink(output))
    } else {
      console.log(output, "this is output")
      setTokenImage(output)
    }
    // }
    
  }, []);

  function UrlExists(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        try {
          http.send();
        } catch {
          return false
        }
        
        console.log(http.status, url, "SLE")
        return (http.status!=404 || http.status!=503 || http.status!=403);
    }


  const onError = () => {
    setTokenImage(fixURL(output))
  }

  return (
    <React.Fragment>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              width="310px"
              height="246px"
              src={tokenImage}
              onError={onError}
              >
        </img>
    </React.Fragment>
  )
}

export default NFTImage