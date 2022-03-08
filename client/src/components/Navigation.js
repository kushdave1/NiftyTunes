import React, {useState, useEffect} from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router'
import styled from 'styled-components'

import ConnectButton from './ConnectButton'
import logo from '../assets/images/NT_White.png'

const NavFormat = styled.div `
    font-weight : 200;
`;

function Navigation() {

    let navigate = useNavigate();


    return (
        <Container>
            <Navbar fixed='top'>
                <Container>   
                <Navbar.Brand className="text-light" style={{fontSize: '35px'}} href="#">
                    NiftyTunes
                    </Navbar.Brand> 
                        <NavFormat>  
                        <Navbar.Collapse className='ms-5'>
                            
                            <Nav.Link className="text-light" href="#action1">Prices</Nav.Link>
                            <Nav.Link className="text-light" href="#action2">Learn</Nav.Link>
                            <Nav.Link className="text-light" href="#action3">Individuals</Nav.Link>
                            <Nav.Link className="text-light" href="#action4">Creators</Nav.Link>
                            <Nav.Link className="text-light" href="#action5">Company</Nav.Link>
                            </Navbar.Collapse>
                            </NavFormat>
                                
                                <Navbar.Collapse className='justify-content-end'>
                                        <ConnectButton />
                                
                                </Navbar.Collapse>
                    </Container>
            </Navbar>
        </Container>
    )
}

export default Navigation
