//react
import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Routes, 
    Route, 
    Link,
    Outlet
} from "react-router-dom"

//bootstrap
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

//components
import MyNFTs from '../nftyprofiles/MyNFTs'

//moralis
import { useMoralis } from 'react-moralis'
import MyListedNFTs from 'components/nftyprofiles/MyListedNFTs'


const HeaderSection = styled.div `
    margin:0;
    position:absolute;
    top:50%;
    left:10%;
    -ms-transform: translate-Y(-40%);
    transform: translateY(-40%);
`;

const ProfileNavSection = styled.div `
    padding-top: 20px;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;

const NFTSection = styled.div `
    flex:1;
    overflow:hidden;
`;

function Collections() {
    const {isAuthenticated, user} = useMoralis();

    return (
        <React.Fragment>
            <HeaderSection>
                        <ProfileNavSection>
                           <Nav className="justify-content-center">
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-light-3" to="collections">Collections</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </ProfileNavSection>
                    
                            <NFTSection className="d-flex justify-content-center">
                                <Outlet />
                            </NFTSection>  
            </HeaderSection>
        </React.Fragment>
    )
}

export default Collections