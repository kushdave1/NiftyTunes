import React from 'react'

//Bootstrap
import Container from 'react-bootstrap/Container'
import CardGroup from 'react-bootstrap/CardGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function CollectionListLayout({children}) {
  return (
        
        <Container fluid className="py-5" >
          
            <Row xs={1} md={4} style={{display: "flex"}}>
                  {children}
            </Row>
        
        </Container>
       
  )
}

export default CollectionListLayout
