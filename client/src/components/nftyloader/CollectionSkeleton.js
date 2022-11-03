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
 
function CollectionSkeleton() {
  return (
    <SkeletonTheme baseColor='#e8e8e8' highlightColor='#f8f8f8' duration={1} enableAnimation='true'>
    <Col xs={1} md={4} lg={4} xl={4} >
      <Card className="bg-grey shadow-sm" 
            border="light" 
            style={{ width: '420px', height: '420px', borderRadius:'.25rem'}} >
                <Container>
                    <Skeleton height={420}/>
                </Container>
      </Card>
    </Col>
    </SkeletonTheme>
  )
}

export default CollectionSkeleton

const NFTCardRow = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 310px;
height: 382px;
flex-wrap: wrap;
`