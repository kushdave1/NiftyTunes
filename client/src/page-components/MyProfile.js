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
import Navigation from '../components/Navigation'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

//components
import MyNFTs from '../components/MyNFTs'

//moralis
import { useMoralis } from 'react-moralis'
import MyListedNFTs from 'components/MyListedNFTs'


const HeaderSection = styled.div `
    margin:0;
    position:absolute;
    top:50%;
    left:10%;
    -ms-transform: translate-Y(-40%);
    transform: translateY(-40%);
`;
const Body = styled.div `
    width:100%;
    height: 100vh;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    background-color:#111111;
    overflow:auto;
`;
const NavigationSection = styled.div`

`;

const ProfileNavSection = styled.div `

`;

const NFTSection = styled.div `
    flex:1;
    overflow:hidden;
`;

const routes = [
    {
        path: "/onsale", 
        main: () => <h2>On Sale</h2>
    }, 
    {
        path: "/sold", 
        main: () => <h2> Sold </h2>
    },
    {
        path: "/owned", 
        main: () => <h2> Owned </h2>
    },
    { 
        path: "/created", 
        main: () => <h2> Created </h2>
    }

];

function MyProfile() {
    const {isAuthenticated, user} = useMoralis();

    return (
        <Body>
            
             <NavigationSection>
                <Navigation />
                </NavigationSection>
                        <ProfileNavSection>
                           <Nav className="justify-content-center">
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-gray" to="onsale">On Sale</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-gray" to="sold">Sold</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-gray" to="owned">Owned</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-gray" to="created">Created</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </ProfileNavSection>
                    
                            <NFTSection className="d-flex justify-content-center">
                                <Outlet />
                            </NFTSection>  
        </Body>
    )
}

export default MyProfile