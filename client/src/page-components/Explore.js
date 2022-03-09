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



function Explore() {
    return (
    <React.Fragment>
        <Navigation />
        
        <Body>
            <HeaderSection>
                <Container fluid='md' className='align-middle'>
                    <Row className="align-items-center">
                        <Col>
                            <h1 className="text-light display-3"> NFTY Marketplace Coming Soon...</h1>
                            <h5 className="text-muted">In the meantime.. </h5>
                        </Col>
                        <Col>
                        
                        </Col>
                    </Row>

                {/*
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
                */}

                </Container>
            </HeaderSection>

            

        </Body>
        
        
       

    </React.Fragment>
        

    )
}

export default Explore
