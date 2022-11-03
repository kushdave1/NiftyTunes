import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'

function ComingSoon() {
  let navigate = useNavigate();
  return (
    <div style={{position: "relative", height: "1098px", background: "#F6A2B1"}}>
    <center>
    <div variant="danger" style={{padding: "50px", fontSize: 24}}>Coming Soon...</div>
    </center>
    </div>
  )
}

export default ComingSoon