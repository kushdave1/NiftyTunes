import React from 'react'
import { useEffect } from 'react'
//bootstrap
import Container from 'react-bootstrap/Container'

function NFTPlayerLarge({output}) {
  useEffect(() => {
    console.log('helloooooo')
  }, []);
  return (
    
    <React.Fragment>
        <video 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              className="shadow"
              style={{borderRadius:'.25rem'}} 
              controls
              height="600"
              src={output}
              loop={true}
              autoPlay
              muted>
        </video>
    </React.Fragment>
  )
}

export default NFTPlayerLarge