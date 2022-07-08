import React, { useState } from 'react'

//Explore components
import NFTTokenIds from '../nftymarketplace/NFTTokenIds'

//Layouts
import ProductListLayout from '../nftylayouts/ProductListLayout'
import ProductCardsLayout from '../nftylayouts/ProductCardsLayout'
import FilterLayout from '../nftylayouts/FilterLayout'

//Bootstrap
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import nftyimg from "../../assets/images/NT_Black_2.png";

//Moralis
import {useMoralis} from 'react-moralis'

const MarketPlaceSection = styled.div `
    padding: 50px;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;

const SearchAndFilterSection = styled.div``;
const TrendingSection = styled.div``;

function Explore() {
    const {isAuthenticated, user} = useMoralis();

    return (
      <MarketPlaceSection>
        <Container fluid className="d-flex p-3" style={{fontSize: 24, fontWeight: "bold"}}>
           <Row>Explore NftyTunes</Row>
        </Container>
        <Container fluid className="p-0" style={{backgroundColor: "white"}}>
            <hr></hr>
            <Row className="p-3">
                <Col sm={3} style={{paddingRight: "30px"}}>
                    <FilterLayout></FilterLayout>
                </Col>

                <Col sm={9} style={{ paddingLeft: "30px"}}>
                    
                    <ProductListLayout>
                        <NFTTokenIds/>
                    </ProductListLayout>    
                    
                </Col>
            </Row>
        </Container>
      </MarketPlaceSection>
    )
}

export default Explore
