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
import MyNFTs from '../MyNFTs'

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

const ProfileNavSection = styled.div `

`;

const NFTSection = styled.div `
    flex:1;
    overflow:hidden;
`;

function MyProfile() {
    const {isAuthenticated, user} = useMoralis();

    return (
        <React.Fragment>
                        <ProfileNavSection>
                           <Nav className="justify-content-center">
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-light-3" to="onsale">On Sale</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-light-3" to="sold">Sold</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-light-3" to="owned">Owned</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-light-3" to="created">Created</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} className = "text-light-3" to="activity">Activity</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </ProfileNavSection>
                    
                            <NFTSection className="d-flex justify-content-center">
                                <Outlet />
                            </NFTSection>  
        </React.Fragment>
    )
}

export default MyProfile