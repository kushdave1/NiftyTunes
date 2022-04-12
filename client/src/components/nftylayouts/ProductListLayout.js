import React from 'react'

//Bootstrap
import Container from 'react-bootstrap/Container'
import CardGroup from 'react-bootstrap/CardGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function ProductListLayout({children}) {
  return (
    <Container>
        <Row xs={1} md={2} className='g-4'>
            {children}
        </Row>
    </Container>
  )
}

export default ProductListLayout