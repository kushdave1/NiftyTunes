import React, { useState, useEffect } from 'react'

import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Carousel from 'react-bootstrap/Carousel'
import Video from "../../assets/videos/landing_video.mp4";
import ProductListLayout from '../nftylayouts/ProductListLayout'
import Banner from '../../assets/images/bannerOne.jpeg';
import {useNavigate} from 'react-router'

import MarketplaceGroup from '../../assets/images/MarketplaceGroup.png'
import LoopsGroup from '../../assets/images/LoopsGroup.png'

import GroupOne from "../../assets/images/Group 1.png"
import GroupTwo from "../../assets/images/Group 2.png"
import Moralis from 'moralis';
import { useMoralis } from 'react-moralis'

import LiveMintingLanding from "../../assets/images/LiveMintingLanding.png"
import NftyLoopsLanding from "../../assets/images/NftyLoopsLanding.png"
import MarketplaceLanding from "../../assets/images/MarketplaceLanding.png"

import img from "../../assets/images/firelips.png";
import Ellipse52 from "../../assets/images/Ellipse 52.png"
import animation from "../../assets/images/loop animation_1.png"
import nftyimgwhite from "../../assets/images/NT_White_Isotype.png"
import kush from "../../assets/images/kush2.jpg"
import bassy from "../../assets/images/bassybob.png"
import nftyimg from "../../assets/images/NT_Black_2.png";
import nftyimgtwo from "../../assets/images/nt_blur.png";
import livemint from "../../assets/images/livemint2.png";
import downarrow from "../../assets/images/downarrow3.png"
import ConnectButton from '../nftynavs/ConnectButton'
import ExploreButton from '../nftynavs/ExploreButton'

import CollectionImage from '../nftymix/CollectionImageLanding'

function Landing() {

    const [show, setShow] = useState(true);
    const [emailEntered, setEmailEntered] = useState('');
    const [nameEntered, setNameEntered] = useState('');
    const [width, setWindowWidth] = useState()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate();
    
    useEffect(() => {

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize",updateDimensions);

    }, [])

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }

    const saveUserInfo = () => {
        const UserInfo = Moralis.Object.extend("UserInfo");
        const userInfo = new UserInfo();
        userInfo.set("FullName", nameEntered);
        userInfo.set("email", emailEntered);
    }

    return (
    <React.Fragment>
    {(responsive.showTopNavMenu) ? (
        <>
        <HeaderSection>
            <CollectDigitalVibes>Collect<br/>Digital Vibes</CollectDigitalVibes>
            <SubHeaderText>Experience and trade audiovisual NFTs from your favorite artists</SubHeaderText>
            <StartCollecting onClick={()=> navigate('/marketplace')}>Start Collecting</StartCollecting>
            <HeaderAnimation src={animation}></HeaderAnimation>
            <Rectangle1>
            </Rectangle1>
            <Group1 src={GroupOne} />

            <HeaderTwo>Made by Artists, <br/>For Artists</HeaderTwo>
            <HeaderTwoCaption>Our live minting protocol is making live experiences timeless. 
                Not only are we empowering artists to create a direct one to one connection with their fans, 
                but we are also bringing them new revenue streams.</HeaderTwoCaption>
            <LiveNFTButton onClick={()=>navigate("/live")}>Experience our Live NFTs</LiveNFTButton>
            <Group2 src={GroupTwo} />
            <HeaderThree>Live Minting</HeaderThree>
            <HeaderThreeCaption>An interactive, immersive, and innovative way to capture experiences on-chain. 
                Whether you experience the moment IRL or via live stream - these moments now live forever.</HeaderThreeCaption>
            <NftytunesLive onClick={()=>navigate("/live")}>Nftytunes Live</NftytunesLive>
            <HeaderFour>Marketplace</HeaderFour>
            <HeaderFourCaption>Our marketplace is for artists, musicians, the crypto curious, and those looking to learn something new. 
                Experience, buy, sell, create, repeat.</HeaderFourCaption>
            <MarketplaceButton onClick={()=>navigate("/live")}>Explore</MarketplaceButton>
            <ComingSoon >Coming Soon</ComingSoon>
            <HeaderFive>Nfty Loops</HeaderFive>
            <HeaderFiveCaption>At NftyTunes, you are the creator. Made by artists, 
                for artists, our platform allows you to build unique and personalized NFTs 
                using your favorite art + music.</HeaderFiveCaption>
            <MarketplaceGroupImage src={MarketplaceGroup} />
            <LoopsGroupImage src={LoopsGroup} />
            
                
                
        </HeaderSection>
        </>
    ) : (
        <>
        <img crossOrigin='true' crossoriginresourcepolicy='false' src={Banner} height="200px" width="100%" style={{backgroundSize: "100%"}}></img>
        <HeaderSection>
            
                <Container className='d-flex flex-column col-xl-12 align-items-stretch' style={{overflow: "hidden"}}>
                    <Row className='mt-auto py-3'>
                    <center>
                        <h1 className="text-dark display-3" style={{fontWeight: "1000", paddingTop: "10%", borderRadius:"2rem"}}>Collect Digital Vibes</h1>
                        <Col className="p-5">
                            <p className="lead text-dark">Purchase, build, and sell musical GIFs from the world's top artists.</p>
                            <ExploreButton />
                        </Col>
                    </center>
                    </Row>
                    <hr/>
            
                    <Row className = "justify-content-center align-items-center" id="livemint">
            
                        
                        <ProductListLayout>
                        <center>
                            <Card className="border-0"
                                style={{ width: '22.5rem', height: '22.5rem', paddingBottom: "20px", borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
                                    <CollectionImage output={LiveMintingLanding} height="130"/> 
                                <Card.Body>
                                    <center style={{paddingTop:"8px"}}>
                                        <Card.Title className="text-dark" style={{fontSize: 24}}>Live Minting</Card.Title>
                                        <Card.Text style={{fontSize: 16, padding: "5px", color: "black"}}>An interactive, immersive, and innovative 
                                        way to capture experiences on-chain. Whether you experience the moment IRL or via live stream - 
                                        these moments now live forever.</Card.Text>
                                    </center>
                                </Card.Body>
                            </Card>
                        
                        
                            <Card className="border-0"
                                style={{ width: '22.5rem', height: '22.5rem', paddingBottom: "20px", borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
                                    <CollectionImage output={NftyLoopsLanding} height="140"/> 
                                <Card.Body>
                                    <center>
                                        <Card.Title className="text-dark" style={{fontSize: 24}}>NftyLoops</Card.Title>
                                        <Card.Text style={{fontSize: 16, padding: "5px", color: "black"}}>At NftyTunes, you are the creator. 
                                        Made by artists, for artists, our platform allows you to build unique and personalized 
                                        NFTs using your favorite art + music. </Card.Text>
                                    </center>
                                </Card.Body>
                            </Card>
                        
                            <Card className="border-0"
                                style={{ width: '22.5rem', height: '22.5rem', paddingTop: "20px", borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
                                    <CollectionImage output={MarketplaceLanding} height="145"/> 
                                <Card.Body>
                                    <center>
                                        <Card.Title className="text-dark" style={{fontSize: 24}}>Marketplace</Card.Title>
                                        <Card.Text style={{fontSize: 16, padding: "5px", color: "black"}}>Our marketplace is for artists, musicians, 
                                        the crypto curious, and those looking to learn something new. Experience, buy, sell, create, repeat. </Card.Text>
                                    </center>
                                </Card.Body>
                            </Card>
                        </center>       
                        </ProductListLayout>   
                 
                            
                    </Row>
                    


                </Container>
            </HeaderSection>
            </>
    )}
            
    </React.Fragment>
        
    )
}

export default Landing


const Rectangle1 = styled.div`
    position: absolute;
    width: 1792px;
    height: 600px;
    left: calc(50% - 1792px/2);
    top: 858px;

    background: #F5F5F5;
`

const HeaderTwo = styled.div`
    /* Made By Artists, For Artists */


    position: absolute;
    width: 600px;
    height: 208px;
    left: calc(50% - 448px/2 + 347px);
    top: 934px;

    /* H2 */

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 900;
    font-size: 110px;
    line-height: 104px;
    /* or 95% */

    text-transform: uppercase;

    color: #000000;
`

const HeaderTwoCaption = styled.div`
    position: absolute;
    width: 504px;
    height: 135px;
    left: calc(50% - 504px/2 + 375px);
    top: 1172px;

    /* Lead */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 27px;

    color: #000000;
`

const LiveNFTButton = styled.button`
    /* Button */


    width: 189px;
    height: 16px;

    /* button_text */

    font-family: 'Graphik LCG';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;
    /* identical to box height */


    color: #000000;
    box-sizing: border-box;

    /* Auto layout */

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;

    position: absolute;
    width: 241px;
    height: 44px;
    left: calc(50% - 241px/2 + 243.5px);
    top: 1351px;

    border: 2px solid #000000;
    border-radius: 50px;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
`

const HeaderAnimation = styled.img`
    position: absolute;
    width: 780px;
    height: 702px;
    left: calc(50% - 780px/2 + 330px);
    top: 98px;
`

const SubHeaderText = styled.div`
    /* Experience and trade audiovisual NFTs from your favorite artists */


    position: absolute;
    width: 477px;
    height: 54px;
    left: calc(50% - 447px/2 - 436.5px);
    top: 514px;

    /* Lead */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 27px;

    color: #000000;
`

const StartCollecting = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;

    color: white;

    position: absolute;
    width: 171px;
    height: 44px;
    left: calc(50% - 171px/2 - 574.5px);
    top: 615px;

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;

    background: #000000;
    border-radius: 50px;
`

const CollectDigitalVibes = styled.div`
    position: absolute;
    width: 635px;
    height: 328px;
    left: calc(50% - 635px/2 - 342.5px);
    top: 143px;

    /* H1 */

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 900;
    font-size: 160px;
    line-height: 168px;
    text-transform: uppercase;

    color: #000000;

`

const HeaderSection = styled.div `
    display:flex;
    flex:1;
    overflow:hidden;
    background-color: #BD9DFF;
    height: 3100px;
    width: 2000px;
`;

const HeaderThree = styled.div`
    /* Live Minting */


    position: absolute;
    width: 500px;
    height: 104px;
    left: calc(50% - 300px/2 - 398.15px);
    top: 1674px;

    /* H2 */

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 900;
    font-size: 110px;
    line-height: 104px;
    /* identical to box height, or 95% */

    text-transform: uppercase;

    color: #000000;
`

const HeaderThreeCaption = styled.div`
position: absolute;
width: 512px;
height: 108px;
left: calc(50% - 512px/2 - 292px);
top: 1838.46px;

/* Lead */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 27px;

color: #000000;
`

const NftytunesLive = styled.button`

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;

    position: absolute;
    width: 166px;
    height: 44px;
    left: calc(50% - 166px/2 - 465px);
    top: 1994.46px;

    background: #000000;
    border-radius: 50px;

    /* button_text */

    font-family: 'Graphik LCG';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;
    /* identical to box height */


    color: #FFFFFF;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
`


const HeaderFour = styled.div`
    position: absolute;
    width: 329px;
    height: 104px;
    left: calc(50% - 329px/2 + 206.5px);
    top: 2185.79px;

    /* H2 */

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 900;
    font-size: 110px;
    line-height: 104px;
    /* identical to box height, or 95% */

    text-transform: uppercase;

    color: #000000;
`

const HeaderFourCaption = styled.div`
position: absolute;
width: 553px;
height: 81px;
left: calc(50% - 553px/2 + 318.5px);
top: 2342.46px;

/* Lead */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 27px;

color: #000000;
`

const MarketplaceButton = styled.button`

    /* Button */


    width: 59px;
    height: 16px;

    /* button_text */

    font-family: 'Graphik LCG';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;
    /* identical to box height */


    color: #FFFFFF;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;

    /* button_text */

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;

    position: absolute;
    width: 111px;
    height: 44px;
    left: calc(50% - 111px/2 + 97.5px);
    top: 2464.46px;

    background: #000000;
    border-radius: 50px;
`

const MarketplaceGroupImage = styled.img`
position: absolute;
width: 563.3px;
height: 568.04px;
left: calc(50% - 650px/2 - 335px);
top: 2156.69px;

transform: rotate(-12.81deg);
`

const LoopsGroupImage = styled.img`
position: absolute;
width: 742.45px;
height: 498.1px;
left: calc(50% - 650px/2 + 335px);
top: 2619px;

`


const HeaderFive = styled.div`
    
position: absolute;
width: 500px;
height: 104px;
left: calc(50% - 268px/2 - 414.15px);
top: 2750.79px;

/* H2 */

font-family: 'Druk Cyr';
font-style: italic;
font-weight: 900;
font-size: 110px;
line-height: 104px;
/* identical to box height, or 95% */

text-transform: uppercase;

color: #000000;
`

const HeaderFiveCaption = styled.div`
/* At NftyTunes, you are the creator. Made by artists, for artists, our platform allows you to build unique and personalized NFTs using your favorite art + music. */


position: absolute;
width: 478px;
height: 108px;
left: calc(50% - 478px/2 - 309.15px);
top: 2915.51px;

/* Lead */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 27px;

color: #000000;
`


const ComingSoon = styled.div`
/* COMING SOON */


width: 500px;
height: 37px;

/* H6 */

font-family: 'Druk Cyr';
font-style: italic;
font-weight: 700;
font-size: 34px;
line-height: 101.8%;
/* identical to box height, or 37px */

letter-spacing: 0.01em;
text-transform: uppercase;

/* black */

color: #000000;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;

display: flex;
flex-direction: row;
align-items: center;
padding: 0px;

position: absolute;

left: calc(50% - 136px/2 - 480px);
top: 2728.46px;
`

const Group1 = styled.img`
    position: absolute;
    width: 100vh;
    height: 784px;
    left: calc(50% - 996.02px/2 - 397.99px);
    top: 829px;
`

const Group2 = styled.img`
    position: absolute;
    width: 715.34px;
    height: 490.3px;
    left: calc(50% - 650px/2 + 335px);
    top: 1572.85px;
`

const Ellipse1 = styled.img `
    /* Ellipse 52 */


    position: absolute;
    width: 867.49px;
    height: 349.69px;
    left: 137.06px;
    top: 850.79px;

    transform: matrix(0.79, 0.55, -0.66, 0.81, 0, 0);
`;

const Ellipse2 = styled.div `
    /* Ellipse 2 */


    position: absolute;
    width: 450px;
    height: 450px;
    overflow: hidden;
    /* Orange */

    // background: #FCA17D;
    background-image: url(${img});
    filter: blur(100.736px);
`;

const Ellipse3 = styled.div `
    /* Ellipse 1 */


    position: absolute;
    width: 250px;
    height: 250px;
    overflow: hidden;

    /* Pink */

    background-image: url(${img});
    filter: blur(100.736px);
`;

const nftyImage = styled.div `
    /* Ellipse 1 */


    position: absolute;
    width: 250px;
    height: 250px;
    overflow: hidden;

    /* Pink */

    background-image: url(${img});
    filter: blur(100.736px);
`;

const Ellipse4 = styled.div `
    /* Ellipse 2 */


    position: absolute;
    width: 450px;
    height: 450px;
    overflow: hidden;
    /* Orange */

    // background: #FCA17D;
    //background-image: url(${img});
    filter: blur(100.736px);
    `;
const VideoContainer = styled.div `
    /* Example Video */
    
`;
   
