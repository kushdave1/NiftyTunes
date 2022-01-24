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

const Jumbo = styled.div `
    width:100%;
    height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(${Bg_image});
`;
const HeaderSection = styled.div `
    margin:0;
    position:absolute;
    top:30%;
    left:10%;
    -ms-transform: translate-Y(-40%)
    transform: translateY(-40%)
`;
const Section = styled.div `
   border-radius:50px;
`;

function Landing() {
    return (
    <React.Fragment>
        <Navigation />
        
        <Jumbo>
            <HeaderSection>
                <Container fluid='md' className='align-middle'>
                    <Row className="align-items-center">
                        <Col>
                            <h1 className="text-light display-3"> Collect, mix, and sell spectacular NFTs</h1>
                            <h4 class="text-muted">NiftyTunes is the world's first and only audio-visual NFT builder and marketplace</h4>
                        </Col>
                        <Col sm={4}>
                        <Form className="d-flex gap-2">
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
                                <Button variant="outline-success" style={{width:"30%"}}>Sign up</Button>
                        </Form>
                            <small class="text-muted">Join our mailing list to tap into the next generation of NFTs!</small>
                        </Col>
                    </Row>
                </Container>
            </HeaderSection>
        </Jumbo>
        
        <Section>
            <Container>
                <h1> Section Content</h1>
            </Container>
        </Section>

    </React.Fragment>
        

    )
}

export default Landing
   
