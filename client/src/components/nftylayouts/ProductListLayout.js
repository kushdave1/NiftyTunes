import React from 'react'

//Bootstrap
import Container from 'react-bootstrap/Container'
import CardGroup from 'react-bootstrap/CardGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function ProductListLayout({children}) {
  return (
        
        <Container className="py-4">
          
            <Row xs={1} md={4} style={{display: "flex"}}>
                  {children}
            </Row>
        
        </Container>
       
  )
}

export default ProductListLayout
