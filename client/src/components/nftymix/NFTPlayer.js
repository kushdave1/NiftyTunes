import React from 'react'

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTPlayer({output}) {
  return (
    <React.Fragment>
        <video 
              crossOrigin='true'
              className="shadow"
              style={{borderRadius:'.25rem'}} 
              controls
              height="300"
              src={output}
              loop={true}
              autoPlay
              muted>
        </video>
    </React.Fragment>
  )
}

export default NFTPlayer