import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'

function ComingSoon() {
  let navigate = useNavigate();
  return (
    <center>
    <div variant="danger" style={{padding: "50px", fontSize: 14}}>Coming Soon...</div>
    </center>
  )
}

export default ComingSoon