import React from 'react'
import styled from 'styled-components'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
const Background = styled.div`
    height: 100vh;
    width: 100%;
    background: hsla(346, 84%, 61%, 1);
    background: linear-gradient(135deg, hsla(346, 84%, 61%, 1) 0%, hsla(21, 91%, 73%, 1) 100%);
    background: -moz-linear-gradient(135deg, hsla(346, 84%, 61%, 1) 0%, hsla(21, 91%, 73%, 1) 100%);
    background: -webkit-linear-gradient(135deg, hsla(346, 84%, 61%, 1) 0%, hsla(21, 91%, 73%, 1) 100%);
    filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#EF476F", endColorstr="#F9A87B", GradientType=1 );
`;

function Onboard() {
    return (
        <Background>
            <Container className = "h-100">
                <Row className = "align-items-center h-100">
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <Button variant="secondary">Make A NiftyTune</Button>
                        <Button variant="outline-secondary">Buy A NiftyTune</Button>
                    </Stack>  
                </Row>
            </Container>
        </Background>
    )
}

export default Onboard
