import React from 'react'

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTPlayer({output}) {
  return (
    <React.Fragment>
        <video 
              crossOrigin='true'
              className="shadow"
              style={{borderRadius:'1rem' }} 
              controls
              height="400"
              src={output}
              loop={true}
              autoPlay
              className = "p-2"
              muted>
        </video>
    </React.Fragment>
  )
}

export default NFTPlayer