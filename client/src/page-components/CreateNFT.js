import React from 'react'
import styled from 'styled-components'

import Container from 'react-bootstrap/Container'
import AccountNav from '../components/AccountNav'
import NFTForm from '../components/NFTForm'

const Background = styled.div`
    height: 100vh;
    width: 100%;
    background: hsla(346, 84%, 61%, 1);
    background: #111111
`;

const FormSection = styled.div `
    margin:0;
    position:absolute;
    top:50%;
    left:35%;
    -ms-transform: translate-Y(-35%);
    transform: translateY(-35%);
`;

function CreateNFT() {
    

    return (
        <Background>
            <AccountNav />
            
            <FormSection>
                    <NFTForm />
            </FormSection>
        </Background>
    )
}

export default CreateNFT
