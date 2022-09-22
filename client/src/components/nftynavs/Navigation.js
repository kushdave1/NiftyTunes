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

import vector1 from "../../assets/images/Vector 1.png"
import vector2 from "../../assets/images/Vector 2.png"
import vector3 from "../../assets/images/Vector 3.png"
import vector4 from "../../assets/images/Vector 4.png"
import vector5 from "../../assets/images/Vector 5.png"
import vector6 from "../../assets/images/Vector 6.png"

import explore from "../../assets/images/Explore.png"
import loops from "../../assets/images/Nftyloops.png"




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
            <Navbar bg='black' style={{height: "70px"}}>
                <Navbar.Brand href="#" onClick={()=> navigate('/')}>
                    <Logo>
                        <Rectangle1>
                            <Vector1 src={vector1} />
                            <Vector2 src={vector2} />
                            <Vector3 src={vector3} />
                            <Vector4 src={vector4} />
                            <Vector5 src={vector5} />
                            <Vector6 src={vector6} />
                            <LiveMints>Digital<br/>Vibes</LiveMints>
                        </Rectangle1>
                            
                            
                        <LogoFont>NFTYTUNES</LogoFont></Logo>
                </Navbar.Brand> 
                        <NavFormat className="ml-auto">  
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
                                <MarketButtonConnected onClick={()=>navigate('/marketplace')}>Marketplace</MarketButtonConnected>
                                <Ellipse3Connected onClick={()=> navigate('/live')}></Ellipse3Connected>
                                <LiveButtonConnected onClick={()=> navigate('/live')}>
                                NftyTunes Live</LiveButtonConnected>
                                <Navbar.Collapse>
                                        <AccountButton />
                                </Navbar.Collapse>
                                </>
                                ):
                                (<>
                                <MarketButton onClick={()=>navigate('/marketplace')}>Marketplace</MarketButton>
                                <Ellipse3 onClick={()=> navigate('/live')}></Ellipse3>
                                <LiveButton onClick={()=> navigate('/live')}>
                                NftyTunes Live</LiveButton>
                                <ConnectButton />
                                </>)
                            }

                            
                        </Navbar.Collapse>
                        </NavFormat>
                                
                                
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



const Vector1 = styled.img`
    /* Vector 1 */


    position: absolute;
    left: 4.71%;
    right: 81.22%;
    top: 9.53%;
    bottom: 9.53%;
    width: 19.71px;
    height: 56.66px;


    /* black */

    // border: 0.722645px solid #000000;
    // border-radius: 2.8px;
`

const Vector2 = styled.img`
    /* Vector 2 */


    position: absolute;
    left: 14.52%;
    right: 71.41%;
    top: 9.53%;
    bottom: 9.53%;
    width: 19.71px;
    height: 56.66px;

    /* black */

    // border: 0.722645px solid #000000;
    // border-radius: 2.8px;
`

const Vector3 = styled.img`
    /* Vector 3 */


    position: absolute;
    left: 24.32%;
    right: 61.6%;
    top: 9.53%;
    bottom: 9.53%;
    width: 19.71px;
    height: 56.66px;

    /* black */

    // border: 0.722645px solid #000000;
    // border-radius: 2.8px;
`

const Vector4 = styled.img`
    /* Vector 4 */


    position: absolute;
    left: 34.14%;
    right: 51.79%;
    top: 9.53%;
    bottom: 9.53%;
    width: 19.71px;
    height: 56.66px;

    /* black */

    // border: 0.722645px solid #000000;
    // border-radius: 2.8px;
`

const Vector5 = styled.img`
    /* Vector 5 */


    position: absolute;
    left: 43.95%;
    right: 41.98%;
    top: 9.53%;
    bottom: 9.53%;
    width: 19.71px;
    height: 56.66px;

    /* black */

    // border: 0.722645px solid #000000;
    // border-radius: 2.8px;
`

const Vector6 = styled.img`
    /* Vector 6 */


    position: absolute;
    left: 53.75%;
    right: 32.17%;
    top: 9.53%;
    bottom: 9.53%;
    width: 19.71px;
    height: 56.66px;

    /* black */

    // border: 0.722645px solid #000000;
    // border-radius: 2.8px;
`

const LiveMints = styled.div`
    position: absolute;
    right: 5px;
    top: 44.29%;
    bottom: 44.29%;

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 15.3479px;
    line-height: 16px;
    /* or 102% */

    text-align: center;
    text-transform: uppercase;

    /* black */

    color: #000000;

    transform: rotate(-90deg);
`



const Logo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 20px 0px 0px;
    gap: 18px;

    position: absolute;
    width: 337px;
    height: 70px;
    left: 0px;
    top: 0px;

    /* black */

    background: #000000;
`

const Rectangle1 = styled.div`
    position: absolute;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    width: 140px;
    height: 70px;

    /* white */

    background: #FFFFFF;
`

const LogoFont = styled.div`
    font-family: 'Druk Cyr';
    position: absolute;
    color: #FFFFFF;
    right: 35px;
    font-size: 48px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
`


const NavFormat = styled.div `
    font-weight : 200;
`;


const Ellipse3Connected = styled.div`
position: absolute;
width: 8px;
right: 332px;
border-radius: 2rem;
top: 44.29%;
bottom: 44.29%;
cursor: pointer;

/* fuchsia */

background: #FF007A;
`

const LiveButtonConnected = styled.div`
/* NftyTunes Live */


position: absolute;
width: 114px;
right: 208px;
top: 38.57%;
bottom: 38.57%;

/* menu */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
cursor: pointer;
/* identical to box height */


color: #FFFFFF;
`

const MarketButtonConnected = styled.div`
/* Marketplace */


position: absolute;
width: 96px;
right: 376px;
top: 38.57%;
bottom: 38.57%;

/* menu */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */
cursor: pointer;

color: #FFFFFF;
`



const Ellipse3 = styled.div`
position: absolute;
width: 8px;
right: 360px;
border-radius: 2rem;
top: 44.29%;
bottom: 44.29%;
cursor: pointer;

/* fuchsia */

background: #FF007A;
`

const LiveButton = styled.div`
/* NftyTunes Live */


position: absolute;
width: 114px;
right: 236px;
top: 38.57%;
bottom: 38.57%;

/* menu */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */


color: #FFFFFF;
`

const MarketButton = styled.div`
/* Marketplace */


position: absolute;
width: 96px;
right: 392px;
top: 38.57%;
bottom: 38.57%;

/* menu */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */
cursor: pointer;

color: #FFFFFF;
`
