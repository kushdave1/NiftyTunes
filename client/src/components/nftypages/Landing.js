import React from 'react'
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Video from "../../assets/videos/landing_video.mp4";


const HeaderSection = styled.div`
    display:flex;
    flex:1;
    overflow:hidden;
    padding-top:100px;
`;


const Ellipse1 = styled.div `
    /* Ellipse 1 */


    position: absolute;
    width: 425px;
    height: 425px;

    /* Pink */

    background: #FF3998;
    filter: blur(100.736px);
`;

const Ellipse2 = styled.div `
    /* Ellipse 2 */


    position: absolute;
    width: 450px;
    height: 450px;
    /* Orange */

    background: #FCA17D;
    filter: blur(100.736px);
`;

const VideoContainer = styled.div `
    /* Example Video */
    
`;



function Landing() {
    /* document.body.style.overflow = "hidden";*/
    return (
    <React.Fragment>
            <HeaderSection>
                <Container className='d-flex flex-column col-xl-12 py-3 align-items-stretch'>
                    <Row className='mt-auto'>
                        <Col lg={4} md={6} xs={{ order: 'last' }}> 
                            <Row className='mt-auto'>
                                    <Col>
                                        <Ellipse1 />
                                    </Col>
                                    <Col>
                                        <Ellipse2 />
                                    </Col>
                        

                                    <VideoContainer >
                                        <video
                                            className="rounded animate__animated animate__fadeIn animate__delay-4s landing-video"
                                            controls
                                            src={Video}
                                            loop={true}
                                            autoPlay
                                            muted>
                                        </video>
                                    </VideoContainer>
                            </Row>
                       </Col>
                       
                        <Col xs={12} md={6} lg={8}>
                            <Row className='mt-auto'>
                            <small className = 'text-primary animate__animated animate__fadeIn animate__delay-5s' style={{fontWeight:"700", fontSize:'20px'}}>Launching Soon</small>
                            <h1 className="text-light display-3"> 
                                <span className = "animate__animated animate__fadeIn animate__delay-1s">Build Value Through Experiences,</span> 
                                <span className = "animate__animated animate__fadeIn animate__delay-2s">{' '}Not Hype.</span></h1>
                            <Col xs={12} md={8}>
                                <p className="lead text-light animate__animated animate__fadeInLeft animate__delay-4s">Powered by a community of professional artists you know and love, 
                                the NftyTunes platform allows you to build, sell, and buy NFTs that provide something truly tangible.</p>
                            </Col>
                            </Row>
                        </Col>

                    </Row>
                    
                    
                    <Row xs={12} className = 'mt-auto justify-content-between animate__animated animate__fadeIn animate__delay-4s'>
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
                            <Col xs={12}>
                                <small className="text-light"> Don't miss out on our hard launch! Follow us on social media.</small>
                            </Col>
                        </Row>
                        </Col>
                        
                        <Col className='border border-right-0 border-white rounded p-3 d-none d-lg-block' md={4}>
                                <h4 className='text-light text-center align-middle'>Authenticate with MetaMask to get started!</h4>
                            </Col>
                      
                    </Row>

                </Container>
            </HeaderSection>
    </React.Fragment>
        
    )
}

export default Landing
   
