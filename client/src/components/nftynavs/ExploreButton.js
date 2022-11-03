import React from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Button from 'react-bootstrap/Button'

function ExploreButton() {
  let navigate = useNavigate();
  return (
    <button onClick={()=> navigate('/live')}>Start Collecting</button>
  )
}

export default ExploreButton