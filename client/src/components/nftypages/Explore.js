import React, { useState } from 'react'

//Explore components
import NFTTokenIds from '../nftymarketplace/NFTTokenIds'
import FullFilterBar from '../nftymarketplace/Filter'

//Layouts
import ProductListLayout from '../nftylayouts/ProductListLayout'
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
    position: relative;
    width: 100%;
    height: 2385px;

    /* pink */

    background: #F6A2B1;
`;

const SearchAndFilterSection = styled.div``;
const TrendingSection = styled.div``;

function Explore() {
    const {isAuthenticated, user} = useMoralis();

    return (
      <MarketPlaceSection>
        <MarketplaceTitle>Marketplace</MarketplaceTitle>
        
        <FullFilterBar/>
        



        <MarketContainer>
            <MarketRow >
                

                
                    
                <ProductListLayout>
                    <NFTTokenIds/>
                </ProductListLayout>    
                    
               
            </MarketRow>
        </MarketContainer>
      </MarketPlaceSection>
    )
}

export default Explore

const MarketContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 40px;

    position: absolute;
    width: 1300px;
    height: 1648px;
    left: calc(50% - 1300px/2);
    top: 438px;
`

const MarketRow = styled.div`

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    width: 1300px;
    height: 382px;
`



const MarketplaceTitle = styled.div`
    position: absolute;
    width: 329px;
    height: 104px;
    left: calc(50% - 329px/2 - 485.5px);
    top: 150px;

    /* H2 */

    font-family: 'Druk Cyr';

    font-weight: 900;
    font-size: 110px;
    line-height: 104px;
    /* identical to box height, or 95% */

    text-transform: uppercase;

    color: #000000;
`

