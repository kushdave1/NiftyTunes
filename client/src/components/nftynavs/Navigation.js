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

import live from "../../assets/images/LiveButton.png"
import vector1 from "../../assets/images/Vector 1.png"
import vector2 from "../../assets/images/Vector 2.png"
import vector3 from "../../assets/images/Vector 3.png"
import vector4 from "../../assets/images/Vector 4.png"
import vector5 from "../../assets/images/Vector 5.png"
import vector6 from "../../assets/images/Vector 6.png"
import explore from "../../assets/images/Explore.png"
import loops from "../../assets/images/Nftyloops.png"
import hamburger from '../../assets/images/hamburger.png'
import XWhite from '../../assets/images/Vector White Mobile.png'

import * as Desktop from '../nftyCSS/NavigationDesktop'
import * as Mobile from '../nftyCSS/NavigationMobile'

function Navigation() {
    const {isAuthenticated, user} = useMoralis();
    const [search, setSearch] = useState("");
    const [width, setWindowWidth] = useState();
    const [data, setData] = useState([{
        name: "",
        owner: "",
    }]);
    const [showDropdown, setShowDropdown] = useState(false)
    const handleOpenDropdown = () => setShowDropdown(true)
    const handleCloseDropdown = () => setShowDropdown(false)
    const toggleDropdown = () => setShowDropdown(p => !p)
    

    let navigate = useNavigate();

    useEffect(() => {
        updateDimensions();
        if(!user) return null;
        fetchTokenIds();

        window.addEventListener("resize", updateDimensions);
        console.log(width, responsive.showTopNavMenu, showDropdown, "asfinaifn")

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

     const XFull = () => {
        return (
            <div>
                <Mobile.XButton1 src={XWhite}/>
                <Mobile.XButton2 src={XWhite}/>
            </div>
        )
    }

    return (
        <>
        {(responsive.showTopNavMenu) ? (
            <Navbar bg='black' style={{height: "70px"}}>
                <Navbar.Brand href="#" onClick={()=> navigate('/')}>
                    <Desktop.Logo>
                        <Desktop.Rectangle1>
                            <Desktop.Vector1 src={vector1} />
                            <Desktop.Vector2 src={vector2} />
                            <Desktop.Vector3 src={vector3} />
                            <Desktop.Vector4 src={vector4} />
                            <Desktop.Vector5 src={vector5} />
                            <Desktop.Vector6 src={vector6} />
                            <Desktop.LiveMints>Digital<br/>Vibes</Desktop.LiveMints>
                        </Desktop.Rectangle1>
                            
                            
                        <Desktop.LogoFont>NFTYTUNES</Desktop.LogoFont>
                    </Desktop.Logo>
                </Navbar.Brand> 
                        <Desktop.NavFormat className="ml-auto">  
                        <Navbar.Collapse className='ms-5'>
                            {/* <div className="search-container">
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
                            </div> */}
                            {/* <Nav.Link className="text-dark-2" onClick={()=>navigate('/collections')} style={{fontWeight:"500"}}>Collections</Nav.Link>
                            <Nav.Link className="text-dark-2" onClick={()=>navigate('/staking')} style={{fontWeight:"500"}}>NFT Staking</Nav.Link> */}
                            {/* <Nav.Link className="text-dark-2" onClick={()=>navigate('/wethbalance')} style={{fontWeight:"500"}}>WETH Balance</Nav.Link> */}
                            {/* <Nav.Link className="text-dark-2" href="#action3" style={{fontWeight:"500"}}>Creators</Nav.Link> */}
                            
                            
                            
                            
                            {user?
                                (
                                <>
                                <Desktop.MarketButtonConnected onClick={()=>navigate('/gallery')}>Gallery</Desktop.MarketButtonConnected>
                                <Desktop.Ellipse3Connected onClick={()=> navigate('/live')}></Desktop.Ellipse3Connected>
                                <Desktop.LiveButtonConnected onClick={()=> navigate('/live')}>
                                NftyTunes Live</Desktop.LiveButtonConnected>
                                <Navbar.Collapse>
                                        <AccountButton />
                                </Navbar.Collapse>
                                </>
                                ):
                                (<>
                                <Desktop.MarketButton onClick={()=>navigate('/gallery')}>Gallery</Desktop.MarketButton>
                                <Desktop.Ellipse3 onClick={()=> navigate('/live')}></Desktop.Ellipse3>
                                <Desktop.LiveButton onClick={()=> navigate('/live')}>
                                NftyTunes Live</Desktop.LiveButton>
                                <ConnectButton />
                                </>)
                            }

                            
                        </Navbar.Collapse>
                        </Desktop.NavFormat>
                                
                                
            </Navbar>
        ) : (
            <Navbar bg='black' style={{height: "70px", width: "100vw"}}>
                <Navbar.Brand href="#" onClick={()=> navigate('/')}>
                    <Mobile.Logo>
                        <Mobile.LogoFont>NFTYTUNES</Mobile.LogoFont>
                    </Mobile.Logo>
                </Navbar.Brand> 
                        <>
                        {showDropdown ? (
                            <Mobile.XButton onClick={()=>handleCloseDropdown()}>
                          
                                    <Mobile.XButton1 src={XWhite}/>
                                    <Mobile.XButton2 src={XWhite}/>
                       
                            </Mobile.XButton>
                            
                        ) : (<Mobile.HamburgerMenu onClick={()=>handleOpenDropdown()}>
                            <Mobile.HamburgerSection >
                                <Mobile.HamburgerLine/>
                                <Mobile.HamburgerLine/>
                                <Mobile.HamburgerLine/>
                            </Mobile.HamburgerSection>
                        </Mobile.HamburgerMenu>)}
                        {showDropdown && <AccountMobileButton showDropdown={showDropdown} handleShow={handleOpenDropdown}
                        handleClose={handleCloseDropdown}/>}
                        </>
                    
                
                       
                                
                {/* {(user) ? (<AccountMobileButton />) : (<ConnectButton/>)} */}
                    
                
            </Navbar>
        )}
        </>
    )
}

export default Navigation




