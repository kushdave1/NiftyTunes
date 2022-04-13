import React from 'react'

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

//custom
import NFTPlayer from '../nftymix/NFTPlayer'

//loading skeleton
import Skeleton from "react-loading-skeleton";

 
function ProductCardsLayout({image, name, description}) {
  return (
    <Col xs={1} md={4}>
      <Card className="bg-dark shadow-sm p-2" 
            style={{ width: '20rem', height: '30rem', borderRadius:'.25rem'}} >
            <NFTPlayer output={image}/>
          
          <Card.Body>
            <Row>
                  <Col>
                    <></>
                  </Col>
                  <Col md={6}>
                      <Card.Title className="text-light">{name}</Card.Title>
                      <Card.Text className="text-light">{description}</Card.Text>
                  </Col>
              </Row>
          </Card.Body>
      </Card>
    </Col>
  )
}

export default ProductCardsLayout