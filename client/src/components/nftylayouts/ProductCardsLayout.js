import React from 'react'

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
//custom
import NFTPlayer from '../nftymix/NFTPlayer'
 
function ProductCardsLayout({image, name, description}) {
  return (
    <Col>
      <Card className="bg-dark shadow-sm" border="light" style={{ width: '20rem', height: '30rem', borderRadius:'1rem' }} >
        <NFTPlayer output={image}/>
          <Card.Body>
          <Card.Title className="text-light">{name}</Card.Title>
          <Card.Text className="text-light">{description}</Card.Text>
          </Card.Body>
      </Card>
    </Col>
  )
}

export default ProductCardsLayout