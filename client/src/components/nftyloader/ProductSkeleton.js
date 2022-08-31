import React from 'react'

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

//loading skeleton
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
 
function ProductSkeleton() {
  return (
    <SkeletonTheme baseColor='#e8e8e8' highlightColor='#f8f8f8' duration={1} enableAnimation='true'>
    <Col xs={1} md={4}>
      <Card className="bg-grey shadow-sm" 
            border="light" 
            style={{ width: '20rem', height: '30rem', borderRadius:'.25rem'}} >
                <Container>
                    <Skeleton height={300}/>
                </Container>
          <Card.Body>
              <Row>
                  <Col>
                    <Skeleton circle={true} height={50} width={50}/>
                  </Col>
                  <Col md={6}>
                    <Skeleton count={2}/>
                  </Col>
              </Row>
          </Card.Body>
      </Card>
    </Col>
    </SkeletonTheme>
  )
}

export default ProductSkeleton