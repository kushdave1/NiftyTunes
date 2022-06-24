import React, { useState, useEffect } from 'react'

import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Video from "../../assets/videos/landing_video.mp4";

import Moralis from 'moralis';
import { useMoralis } from 'react-moralis'

import img from "../../assets/images/firelips.png";
import ConnectButton from '../nftynavs/ConnectButton'
import ExploreButton from '../nftynavs/ExploreButton'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardVideo, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';


const HeaderSection = styled.div `
    display:flex;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;


const Ellipse1 = styled.div `
    /* Ellipse 1 */


    position: absolute;
    width: 250px;
    height: 250px;

    /* Pink */

    background-image: url(${img});
    filter: blur(20.736px);
`;

const Ellipse2 = styled.div `
    /* Ellipse 2 */


    position: absolute;
    width: 450px;
    height: 450px;
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

    /* Pink */

    background-image: url(${img});
    filter: blur(100.736px);
`;

const Ellipse4 = styled.div `
    /* Ellipse 2 */


    position: absolute;
    width: 450px;
    height: 450px;
    /* Orange */

    // background: #FCA17D;
    //background-image: url(${img});
    filter: blur(100.736px);
    `;
const VideoContainer = styled.div `
    /* Example Video */
    
`;



function Landing() {

    const [show, setShow] = useState(true);
    const [emailEntered, setEmailEntered] = useState('');
    const [nameEntered, setNameEntered] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const saveUserInfo = () => {
        const UserInfo = Moralis.Object.extend("UserInfo");
        const userInfo = new UserInfo();
        console.log('hi')
        userInfo.set("FullName", nameEntered);
        userInfo.set("email", emailEntered);
    }

    return (
    <React.Fragment>
            <HeaderSection>
                <Container className='d-flex flex-column col-xl-12 py-3 align-items-stretch'>
                    <Row className='mt-auto' >
                        <Col lg={4} md={6} xs={{ order: 'last' }}> 
                            <Row className='mt-auto'>
                                    <Col> 
                                        <Ellipse1 />
                                    </Col>
                                    <Col>
                                        <Ellipse2 />
                                    </Col>
                        
                                <Card className="bg-light shadow-sm p-0" style={{borderRadius:'2.00rem', cursor: "pointer", overflow: "hidden"}}>
                                    <div style={{borderRadius:'2.00rem', overflow: "hidden"}}>
                                        <video
                                            className="rounded animate__animated animate__fadeIn animate__delay-1s"
                                            controls
                                            src={Video}
                                            loop={true}
                                            autoPlay
                                            muted
                                            style={{width: "100%"}}
                                            >
                                        </video>
                                    </div>
                                    <Card.Footer>
                                        <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                                            {/* <Col>
                                            <></>
                                            </Col> */}
                                            <Col>
                                                <Card.Title className="text-dark" style={{fontSize: 12}}>FireLips</Card.Title>
                                                <Card.Title className="text-dark" style={{fontSize: 12}}>Molly Diario</Card.Title>
                                            </Col>
                                            <Col>
                                                <Card.Title className="text-dark" style={{fontSize: 12, justifyContent: 'right', display: "flex"}}>Release Date: May 22, 2022</Card.Title>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Row>
                       </Col>
                       
                        <Col xs={12} md={8} lg={8}>
                            <Row className='mt-auto'>
                            {/* <small className = 'text-primary animate__animated animate__fadeIn animate__delay-5s' style={{fontWeight:"700", fontSize:'20px'}}>Launching Soon</small> */}
                            <h1 className="text-dark display-3" style={{fontWeight: "1000"}}>Collect Digital Vibes</h1>
                            <Col xs={12} md={6}>
                                <p className="lead text-dark">Purchase, build, and sell musical GIFs from the world's top artists.</p>
                            </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                   <ExploreButton />
                                </Col>
                            </Row>
                            <Row className='mt-auto' >
                            <Col> 
                                        <Ellipse3 />
                                    </Col>
                                    <Col>
                                        <Ellipse4 />
                                    </Col>
                            </Row>
                        </Col>

                    </Row>
                    
                    
                    <Row xs={12} className = 'mt-auto justify-content-between animate__animated animate__fadeIn animate__delay-1s'>
                        <Col xs={12} lg={3}>
                            <Row>
                            <Col>
                                    <a href="http://twitter.com/nftytunes">
                                        <i class="bi bi-twitter" style={{fontSize: "2rem", color: "cornflowerblue"}}></i>
                                    </a>
                                </Col>
                            <Col>
                                    <a href="https://discord.gg/hYdz34KF">
                                        <i class="bi bi-discord" style={{fontSize: "2rem", color: "#7289DA"}}></i>
                                    </a>
                                </Col>
                            <Col>
                                    <a href="https://www.reddit.com/user/nftytunes">
                                        <i class="bi bi-reddit" style={{fontSize: "2rem", color: "#FF5700"}}></i>
                                    </a>
                                </Col>
                            <Col>
                                    <a href="https://www.instagram.com/nftytunes/">
                                        <i class="bi bi-instagram" style={{fontSize: "2rem", color: "#8a3ab9"}}></i>
                                    </a>
                                </Col>
                   
                            </Row>
                            <Row>
                            {/* <Col xs={12}>
                                <small className="text-light"> Don't miss out on our hard launch! Follow us on social media.</small>
                            </Col> */}
                        </Row>
                        </Col>
                      
                    </Row>
                    

                </Container>
            </HeaderSection>
    </React.Fragment>
        
    )
}

export default Landing
   
