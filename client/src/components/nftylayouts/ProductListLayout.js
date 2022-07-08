import React from 'react'

//Bootstrap
import Container from 'react-bootstrap/Container'
import CardGroup from 'react-bootstrap/CardGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function ProductListLayout({children}) {
  return (
        <Row xs={1} md={3} className="gx-5">
              {children}
        </Row>
  )
}

export default ProductListLayout
