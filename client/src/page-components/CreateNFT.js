import React, {useState} from 'react'
import styled from 'styled-components'

import Container from 'react-bootstrap/Container'
import AccountNav from '../components/AccountNav'
import NFTForm from '../components/NFTForm'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useMoralis } from 'react-moralis'
const Background = styled.div`
    height: 100vh;
    width: 100%;
    background: hsla(346, 84%, 61%, 1);
    background: #111111;
    overflow:hidden;
`;

const FormSection = styled.div `
    position: relative;
    top:5%;
`;

function CreateNFT() {
    const {isAuthenticated, user} = useMoralis();

    return (
        <Background>
            <AccountNav />
                    <FormSection className="d-flex justify-content-center">
                        <NFTForm />
                    </FormSection>
        </Background>
    )
}

export default CreateNFT
