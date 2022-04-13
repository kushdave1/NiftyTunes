import React, { useState } from 'react'

//Explore components
import NFTTokenIds from '../nftymarketplace/NFTTokenIds'

//Layouts
import ProductListLayout from '../nftylayouts/ProductListLayout'
import ProductCardsLayout from '../nftylayouts/ProductCardsLayout'

//Bootstrap
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

//Moralis
import {useMoralis} from 'react-moralis'

const MarketPlaceSection = styled.div `
`;

const SearchAndFilterSection = styled.div``;
const TrendingSection = styled.div``;

function Explore() {
    const {isAuthenticated, user} = useMoralis();

    return (
       <React.Fragment>
            <TrendingSection>

            </TrendingSection>
            <SearchAndFilterSection>

            </SearchAndFilterSection>
            <MarketPlaceSection className="d-flex justify-content-center">
                <ProductListLayout>
                    <NFTTokenIds />
                </ProductListLayout>               
            </MarketPlaceSection>
      </React.Fragment>
    )
}

export default Explore
