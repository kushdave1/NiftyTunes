import React from 'react'
import styled from 'styled-components'

import AccountNav from '../components/AccountNav'
import NFTForm from '../components/NFTForm'

const Background = styled.div`
    height: 100%;
    width: 100%;
    background: hsla(346, 84%, 61%, 1);
    background: linear-gradient(135deg, hsla(346, 84%, 61%, 1) 0%, hsla(21, 91%, 73%, 1) 100%);
    background: -moz-linear-gradient(135deg, hsla(346, 84%, 61%, 1) 0%, hsla(21, 91%, 73%, 1) 100%);
    background: -webkit-linear-gradient(135deg, hsla(346, 84%, 61%, 1) 0%, hsla(21, 91%, 73%, 1) 100%);
    filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#EF476F", endColorstr="#F9A87B", GradientType=1 );
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
