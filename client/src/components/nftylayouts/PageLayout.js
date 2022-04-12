import React from 'react'
import Navigation from '../nftynavs/Navigation'
import styled from 'styled-components'

const Body = styled.div `
    width:100%;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    background-color:#17171b;
    overflow:auto;
`;

const PageLayout = ({ children }) => {
    return (
    <React.Fragment>
        <Body>
            <Navigation />
            <main>{children}</main>
        </Body>
    </React.Fragment>
    );
};
export default PageLayout;