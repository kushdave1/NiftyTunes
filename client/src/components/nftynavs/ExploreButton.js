import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'

function ExploreButton() {
  let navigate = useNavigate();
  return (
    <Button variant="info" onClick={()=> navigate('/marketplace')}>Start Collecting</Button>
  )
}

export default ExploreButton