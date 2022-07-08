import React from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
//bootstrap
import Container from 'react-bootstrap/Container'

function NFTPlayer({output}) {
  const { resolveLink } = useIPFS();
  const [tokenVideo, setTokenVideo] = useState('')
  useEffect(() => {
    setTokenVideo(resolveLink(output))
  }, []);

  const fixURL = (url) => {
        if(url.startsWith("ipfs")){
          if(url.split("ipfs://").pop().includes("ipfs")) {
            return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop().split("ipfs/").pop()
          } else {
        return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
        }
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
    setTokenVideo(fixURL(output))
  }

  return (
    
    <React.Fragment>
        <video 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              controls
              height="367.5"
              width="100%"
              src={tokenVideo}
              onError={onError}
              loop={true}
              autoPlay
              muted>
        </video>
    </React.Fragment>
  )
}

export default NFTPlayer