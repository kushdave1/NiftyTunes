import React from 'react'
import styled from 'styled-components'

import AccountNav from '../components/AccountNav'
import NFTForm from '../components/NFTForm'

const Background = styled.div`
    height: 100%;
    width: 100%;
    background: hsla(346, 84%, 61%, 1);
    background: #111111
`;

function CreateNFT() {
    

    return (
        <Background>
            <AccountNav />
            <NFTForm />
        </Background>
    )
}

export default CreateNFT
