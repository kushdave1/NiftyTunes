import React, {useState, useEffect} from 'react'
import Moralis from 'moralis';
import axios from 'axios';

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Tooltip, Spin, Input } from "antd";
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router'
import styled from 'styled-components'
import {useMoralis} from 'react-moralis'
import img from "../../assets/images/NT_Black_2.png";
import AccountButton from './AccountButton'
import AccountMobileButton from './AccountMobileButton'
import ConnectButton from './ConnectButton'
import Search from '../nftymarketplace/Search'
import { fixURL, fixImageURL } from "../nftyFunctions/fixURL"
// import live from "../../assets/images/liveTwo.png"
import live from "../../assets/images/LiveButton.png"

import explore from "../../assets/images/Explore.png"
import loops from "../../assets/images/Nftyloops.png"

const NavFormat = styled.div `
    font-weight : 200;
`;

function Navigation() {
    const {isAuthenticated, user} = useMoralis();
    const [search, setSearch] = useState("");
    const [width, setWindowWidth] = useState();
    const [data, setData] = useState([{
        name: "",
        owner: "",
    }]);

    let navigate = useNavigate();

    useEffect(() => {
        updateDimensions();
        if(!user) return null;
        fetchTokenIds();
        console.log(data);

        

        window.addEventListener("resize", updateDimensions);
        console.log(width, responsive.showTopNavMenu, "asfinaifn")

        return () => window.removeEventListener("resize",updateDimensions);

    }, [user]);

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }



    const fetchTokenIds = async() => {

        const ListedNFTs = await Moralis.Object.extend("ListedNFTs");

        const query = new Moralis.Query(ListedNFTs);
        const data = await query.find();

        for (const i in data) {
            const object = data[i];
            const meta = await axios.get(fixURL(object.get("tokenURI")))
            setData((previousNft) => [...previousNft, {
                name: meta.data.name,
                owner: object.get("signerAddress")
            }])
        }
    }

    return (
        <>
        {(responsive.showTopNavMenu) ? (
            <Navbar className="shadow-lg bottom" style={{ padding: 10 }} bg='white' expand="lg">
                <Container>   
                <Navbar.Brand href="#" onClick={()=> navigate('/')}>
                    <img src={img} width="50" height="42.5" className="d-inline-block align-top"
                    alt="React Bootstrap logo"></img>
                    </Navbar.Brand> 
                        <NavFormat className="ml-auto">  
                        <Navbar.Collapse className='ms-5'>
                            <div className="search-container">
                                <div className="search-inner">
                                    <input
                                    type="search"
                                    placeholder="Search for NFTies"
                                    className="me-2"
                                    aria-label="Search"
                                    style={{width:"750px", height: "35px", padding: "5px"}}
                                    onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="dropdown">
                                        {data.filter(item => {
                                            console.log(search.toString())
                                            const searchTerm = search.toLowerCase();
                                            const name = item.name.toLowerCase();
                                            return searchTerm && name.startsWith(searchTerm);
                                        })
                                        .map((item) => (<div className="dropdown-row" style=
                                        {{borderStyle: "solid", 
                                        position: "absolute", 
                                        padding: "5px", 
                                        width: "750px", 
                                        backgroundColor: "white",
                                        cursor: "pointer"}} onClick={()=>{navigate(`/${item.owner}/${item.name}`); setSearch("");}}>{item.name}</div>))}
                                    </div>
                                </div>
                            </div>
                            {/* <Nav.Link className="text-dark-2" onClick={()=>navigate('/collections')} style={{fontWeight:"500"}}>Collections</Nav.Link>
                            <Nav.Link className="text-dark-2" onClick={()=>navigate('/staking')} style={{fontWeight:"500"}}>NFT Staking</Nav.Link> */}
                            {/* <Nav.Link className="text-dark-2" onClick={()=>navigate('/wethbalance')} style={{fontWeight:"500"}}>WETH Balance</Nav.Link> */}
                            {/* <Nav.Link className="text-dark-2" href="#action3" style={{fontWeight:"500"}}>Creators</Nav.Link> */}
                            
                            
                            
                            
                            {user?
                                (
                                <>
                                <Nav.Link className="text-primary" style={{fontWeight:"500", paddingLeft: "0.5rem", paddingRight: "1.5rem"}} onClick={()=> navigate('/live')}>
                                <img style={{display: "inline-block"}} src={live} height="30px" width="81px"></img></Nav.Link>
                                <Nav.Link className="text-dark-2" style={{fontWeight:"500", paddingRight: "1.5rem"}} onClick={()=> navigate('/marketplace')}>
                                Explore</Nav.Link>
                                <Nav.Link className="text-dark-2" style={{fontWeight:"500"}} onClick={()=> navigate('/createnft')}>
                                NftyLoops</Nav.Link>
                                {/* <Nav.Link className="text-dark-2" style={{fontWeight:"500"}} onClick={()=> navigate('/profile')}>My profile</Nav.Link> */}
                                </>
                                ):
                                (<ConnectButton />)
                            }

                            
                        </Navbar.Collapse>
                        </NavFormat>
                                
                                <Navbar.Collapse className='justify-content-end fixed'>
                                        <AccountButton />
                                </Navbar.Collapse>
                    </Container>
            </Navbar>
        ) : (
            <Navbar className="shadow-lg bottom" bg='white' expand="lg">
                <Container>   
                <Navbar.Brand href="#" onClick={()=> navigate('/')}>
                    <img src={img} width="47" height="40" className="d-inline-block align-top"
                    alt="React Bootstrap logo"></img>
                    </Navbar.Brand> 
                       
                                
                    {(user) ? (<AccountMobileButton />) : (<ConnectButton/>)}
                    
                    
                    </Container>
            </Navbar>
        )}
        </>
    )
}

export default Navigation
