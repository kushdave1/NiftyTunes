import React, {useState, useEffect} from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router'
import styled from 'styled-components'
import {useMoralis} from 'react-moralis'
import img from "../../assets/images/NT_Black_2.png";
import AccountButton from './AccountButton'
import ConnectButton from './ConnectButton'
const NavFormat = styled.div `
    font-weight : 200;
`;

function Navigation() {
    const {isAuthenticated, user} = useMoralis();

    let navigate = useNavigate();

    useEffect(() => {
        if(!user) return null;
    }, [user]);

    return (
            <Navbar className="shadow-lg bottom" style={{ paddingBottom: 5 }} bg='white' expand="lg">
                <Container>   
                <Navbar.Brand href="#" onClick={()=> navigate('/')}>
                    <img src={img} width="75" height="65" className="d-inline-block align-top"
                    alt="React Bootstrap logo"></img>
                    </Navbar.Brand> 
                        <NavFormat className="ml-auto">  
                        <Navbar.Collapse className='ms-5'>
                            <Form className="d-flex">
                                <FormControl
                                type="search"
                                placeholder="Search for NFTies"
                                className="me-2"
                                aria-label="Search"
                                style={{width:"750px"}}
                                />
                            </Form>
                            {/* <Nav.Link className="text-dark-2" onClick={()=>navigate('/collections')} style={{fontWeight:"500"}}>Collections</Nav.Link>
                            <Nav.Link className="text-dark-2" onClick={()=>navigate('/staking')} style={{fontWeight:"500"}}>NFT Staking</Nav.Link> */}
                            {/* <Nav.Link className="text-dark-2" onClick={()=>navigate('/wethbalance')} style={{fontWeight:"500"}}>WETH Balance</Nav.Link> */}
                            {/* <Nav.Link className="text-dark-2" href="#action3" style={{fontWeight:"500"}}>Creators</Nav.Link> */}
                            <Nav.Link className="text-dark-2" style={{fontWeight:"500"}} onClick={()=> navigate('/marketplace')}>Explore</Nav.Link>
                            <ConnectButton />
                            {user?
                                (
                                <>
                                <Nav.Link className="text-primary" style={{fontWeight:"500"}} onClick={()=> navigate('/createnft')}>NFT Looper</Nav.Link>
                                <Nav.Link className="text-dark-2" style={{fontWeight:"500"}} onClick={()=> navigate('/about')}>About</Nav.Link>
                                {/* <Nav.Link className="text-dark-2" style={{fontWeight:"500"}} onClick={()=> navigate('/profile')}>My profile</Nav.Link> */}
                                </>
                                ):
                                (<></>)
                            }
                            
                        </Navbar.Collapse>
                        </NavFormat>
                                
                                <Navbar.Collapse className='justify-content-end fixed'>
                                        <AccountButton />
                                </Navbar.Collapse>
                    </Container>
            </Navbar>
    )
}

export default Navigation
