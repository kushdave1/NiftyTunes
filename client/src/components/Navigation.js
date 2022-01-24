import React, {useState, useEffect} from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router'

import ConnectButton from './ConnectButton'

function Navigation() {

    let navigate = useNavigate();


    return (
        <Container>
            <Navbar fixed="top">
                <Container>   
                <Navbar.Brand className="text-light" href="#">NiftyTunes</Navbar.Brand>   
                        <Navbar.Collapse className='justify-content-center'>
                            <Nav.Link className="text-light" href="#action1">Prices</Nav.Link>
                            <Nav.Link className="text-light" href="#action2">Learn</Nav.Link>
                            <Nav.Link className="text-light" href="#action3">Individuals</Nav.Link>
                            <Nav.Link className="text-light" href="#action4">Creators</Nav.Link>
                            <Nav.Link className="text-light" href="#action5">Company</Nav.Link>
                            </Navbar.Collapse>
                                <Navbar.Collapse className='gap-3 justify-content-end'>
                                 
                                        <ConnectButton />
                                
                                </Navbar.Collapse>
                    </Container>
            </Navbar>
        </Container>
    )
}

export default Navigation
