import React, { useState } from 'react'

//Explore components
import MyStaking from '../nftyprofiles/MyStaking'

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
    padding-top: 20px;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;

const SearchAndFilterSection = styled.div``;
const TrendingSection = styled.div``;

function Staking() {
    const {isAuthenticated, user} = useMoralis();

    return (
       <React.Fragment>
            <TrendingSection>

            </TrendingSection>
            <SearchAndFilterSection>

            </SearchAndFilterSection>
            <MarketPlaceSection className="d-flex justify-content-center">
                <ProductListLayout>
                    <MyStaking />
                </ProductListLayout>               
            </MarketPlaceSection>
      </React.Fragment>
    )
}

export default Staking
