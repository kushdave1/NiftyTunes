import React, {useState, useEffect} from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router'

import ConnectButton from './ConnectButton'

function AccountNav() {

    let navigate = useNavigate();

    const collectionsRoute = () => {
        navigate('/collections');
    }

    const stakingRoute = () => {
        navigate('/staking');
    }

    const wethRoute = () => {
        navigate('/wethbalance');
    }

    const exploreRoute = () => {
        navigate('/marketplace');
    }
    
    const createRoute = () => {
        navigate('/createnft')
    }

    const nftRoute = () => {
        navigate('/viewnfts')
    }




    return (
        <Container>
            <Navbar fixed="sticky">
                <Container>   
                <Navbar.Brand className="text-light" style={{fontSize: '35px'}} href="/">NftyTunes</Navbar.Brand>   
                                <Navbar.Collapse className='gap-3 justify-content-end'>
                                        <Button variant="dark" onClick={collectionsRoute}>Collections</Button>
                                        <Button variant="dark" onClick={stakingRoute}>Staking</Button>
                                        <Button variant="dark" onClick={wethRoute}>Deposit WETH</Button>
                                        <Button variant="dark" onClick={exploreRoute}>Explore</Button>
                                        <Button variant="dark" onClick={createRoute}>Create</Button>
                                        <Button variant="dark" onClick={nftRoute}>View my NFTs</Button>
                                        <ConnectButton />
                                
                                </Navbar.Collapse>
                    </Container>
            </Navbar>
        </Container>
    )
}

export default AccountNav