import React from 'react'
import Navigation from '../components/Navigation'
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Bg_image from '../assets/images/background1.jpg'
import LandingCards from '../components/LandingCards'

const Body = styled.div `
    width:100%;
    height: 100vh;
    background-color:#111111;
`;
const HeaderSection = styled.div `
    margin:0;
    position:absolute;
    top:50%;
    left:10%;
    -ms-transform: translate-Y(-40%);
    transform: translateY(-40%);
`;


const Section = styled.div `
   
`;

const Ellipse1 = styled.div `
    /* Ellipse 1 */


    position: absolute;
    width: 311.52px;
    height: 311.52px;
    right: 144px;
    top: 250.15px;

    /* Pink */

    background: #FF3998;
    filter: blur(100.736px);
`;

const Ellipse2 = styled.div `
    /* Ellipse 2 */


    position: absolute;
    width: 216.65px;
    height: 216.65px;
    right: 281.35px;
    top: 415.21px;

    /* Orange */

    background: #FCA17D;
    filter: blur(100.736px);
`;



function Landing() {
    return (
    <React.Fragment>
        <Navigation />
        
        <Body>
            <HeaderSection>
                <Container fluid='md' className='align-middle'>
                    <Row className="align-items-center">
                        <Col>
                            <small className = 'text-primary' style={{fontWeight:"700"}}>Launching Soon</small>
                            <h1 className="text-light display-3"> Build Value Through Experiences, Not Hype.</h1>
                            <h5 className="text-muted">Dont miss out on the launch of our new NFT platform and marketplace. Join our mailing list and tap into the largest community of professionally made audio and visual NFTs!</h5>
                        </Col>
                        <Col>
                        
                        </Col>
                    </Row>

                    <Col xs={6}>
                    <Form className="mt-3 d-flex gap-2">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="alan@turing.com"
                            
                        >
                        <Form.Control 
                                size="lg"
                                type="email"
                                placeholder="alan@turing.com"
                                
                                aria-label="email-input"
                                style={{width:"100%"}}/>
                        </FloatingLabel>
                                <Button variant="secondary" size="md" style={{width:"30%"}}>Sign up</Button>
                        </Form>
                            
                    </Col>

                </Container>
            </HeaderSection>

            {/*
            <Section>
            <Container className="p-5">
                <Row xs={1} md={1} className="g-4">
                    <LandingCards />
                </Row>
            </Container>
            </Section> */}

                        
            <Ellipse1 />
            <Ellipse2 />

        </Body>
        
        
       

    </React.Fragment>
        

    )
}

export default Landing
   
