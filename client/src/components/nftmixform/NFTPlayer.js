import React from 'react'

//bootstrap
import Container from 'react-bootstrap/Container'

function NFTPlayer({output}) {
  return (
    <Container>
        <video
              className="rounded shadow mb-5"
              controls
              width="400"
              src={output}
              loop={true}
              autoPlay
              muted>
        </video>
    </Container>
  )
}

export default NFTPlayer