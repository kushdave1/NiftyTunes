import React, {useState} from 'react'
import styled from 'styled-components'

import Container from 'react-bootstrap/Container'
import Navigation from '../components/Navigation'
import NFTForm from '../components/NFTForm'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useMoralis } from 'react-moralis'
const Body = styled.div `
    width:100%;
    height: 100vh;
    min-height:100vh;
    max-height:100vh;
    display:flex;
    flex-direction:column;
    background-color:#111111;
    overflow:auto;
`;
const NavigationSection = styled.div`

`;

const FormSection = styled.div `
    flex:1;
    overflow:hidden;
`;

function CreateNFT() {
    const {isAuthenticated, user} = useMoralis();

    return (
        <Body>
             <NavigationSection>
                <Navigation />
            </NavigationSection>
                    <FormSection className="d-flex justify-content-center">
                        <NFTForm />
                    </FormSection>
        </Body>
    )
}

export default CreateNFT
