import React from 'react'

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import styled from 'styled-components'
//loading skeleton
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
 
function ProductSkeleton() {
  return (
    <SkeletonTheme baseColor='#e8e8e8' highlightColor='#f8f8f8' duration={1} enableAnimation='true'>
    <NFTCardRow>
    <Col xs={1} md={3} lg={3} xl={3} >
      <Card className="bg-grey shadow-sm" 
            border="light" 
            style={{ width: '246px', height: '280px', borderRadius:'.25rem'}} >
                <Container>
                    <Skeleton height={270}/>
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
    </NFTCardRow>
    </SkeletonTheme>
  )
}

export default ProductSkeleton

const NFTCardRow = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 10px;

width: 310px;
height: 382px;
flex-wrap: wrap;
`