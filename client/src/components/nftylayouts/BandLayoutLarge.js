import styled from 'styled-components'
import legendaryseal from '../../assets/images/legendaryseal.png'
import legendaryband from '../../assets/images/legendarybandlarge.gif'
import rareseal from '../../assets/images/rareseal.png'
import commonseal from '../../assets/images/commonseal.png'
import Row from 'react-bootstrap/Row'
import { useState, useEffect} from 'react'
import Moralis from 'moralis'

function BandLayoutLarge({nft}) {

    useEffect(() => {
        console.log(nft.artistName, !nft.artistName.includes("..."), "CAROS")
    })



    return (
        <>
        {(nft.name.includes("gold") || nft.name.includes("Gold")) ? 
        (
        <WristBand>
            <Seal src={legendaryseal}></Seal>
            <LegendaryBand>
                <BandArtistLayout>
                    
                    <Row className="py-0" style={{width: "319.52px", height: "71.65px"}}>
                        <BlackArtist>
                        {(nft.artistName && !nft.artistName.includes("...")) ? (nft.artistName) : (<>Unnamed</>)}
                        </BlackArtist>
    
                    </Row>
                    <Row className="py-0">
                        <BlackName>
                            {nft.name}
                        </BlackName>
                    </Row>
                    <Row className="py-0">
                        <BlackDescription>
                            <NoWrap>Live @ Nftytunes </NoWrap>12.08.2022
                        </BlackDescription>
                    </Row>

                    
            
                </BandArtistLayout>
            </LegendaryBand>
        </WristBand>
        ) : (nft.name.includes("silver") || nft.name.includes("Silver")) ? (
        <WristBand>
            <Seal src={rareseal}></Seal>
            <RareBand>
                <BandArtistLayout>
                    
                    <Row className="py-0" style={{width: "319.52px", height: "71.65px"}}>
                        <WhiteArtist>
                        {(nft.artistName && !nft.artistName.includes("...")) ? (nft.artistName) : (<>Unnamed</>)}
                        </WhiteArtist>
    
                    </Row>
                    <Row className="py-0">
                        <WhiteName>
                            {nft.name}
                        </WhiteName>
                    </Row>
                    <Row className="py-0">
                        <WhiteDescription>
                            <NoWrap>Live @ Nftytunes </NoWrap>12.08.2022
                        </WhiteDescription>
                    </Row>

                    
            
                </BandArtistLayout>
            </RareBand>
        </WristBand>
        ) : (
        <WristBand>
            <Seal src={commonseal}></Seal>
            <CommonBand>
                <BandArtistLayout>
                    
                    <Row className="py-1" style={{width: "319.52px", height: "71.65px"}}>
                        <BlackArtist>
                        {(nft.artistName && !nft.artistName.includes("...")) ? (nft.artistName) : (<>Unnamed</>)}
                        </BlackArtist>
    
                    </Row>
                    <Row className="py-1">
                        <BlackName>
                            {nft.name}
                        </BlackName>
                    </Row>
                    <Row className="py-1">
                        <BlackDescription>
                            <NoWrap>Live @ Nftytunes </NoWrap>12.08.2022
                        </BlackDescription>
                    </Row>

                    
            
                </BandArtistLayout>
            </CommonBand>
        </WristBand>
        )
    }
        
        </>
    )
}

export default BandLayoutLarge

const NoWrap = styled.div`
    white-space: nowrap;
`

const WristBand = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 30.98px;

    width: 600.32px;
    height: 147.17px;
`

const Seal = styled.img`
    width: 267.24px;
    height: 147.17px;
    margin-top: -10px;
`

const LegendaryBand = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 0px 0px 13.5556px;
    gap: 19.37px;
    margin-top: -10px;
    margin-left: -20px;
    width: 343.08px;
    height: 155.13px;

    background-image: url(${legendaryband});
`

const RareBand = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 0px 0px 13.5556px;
    gap: 19.37px;
    margin-top: -10px;
    margin-left: -20px;
    width: 333.08px;
    height: 155.13px;

    background-color: #FD4758;
`

const CommonBand = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 0px 0px 13.5556px;
    gap: 19.37px;
    margin-top: -10px;
    margin-left: -20px;
    width: 333.08px;
    height: 155.13px;

    background-color: #EDCF92;
`

const BandArtistLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 319.52px;
    height: 145.13px;
`

const BandNameLayout = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 10px;

    width: 165.2px;
    height: 18px;
    overflow-x: scroll;
`

const BlackArtist = styled.div`
    /* H6 */

    width: 114px;
    height: 37px;

    /* H6 */

    font-family: 'Druk Cyr';

    font-weight: 700;
    font-size: 70px;
    line-height: 101.8%;
    white-space: nowrap;
    /* identical to box height, or 37px */

    letter-spacing: 0.01em;
    text-transform: uppercase;

    /* black */

    color: #000000;
`

const BlackName = styled.div`

    /* Caption small */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    /* identical to box height, or 112% */
    overflow-x: scroll;

    text-transform: uppercase;
    line-height: 26px;

    /* black */

    color: #000000;
`

const BlackDescription = styled.div`
    width: 160px;
    height: 35px;

    /* caption very small */

    font-family: 'Graphik LCG Regular';
    overflow-x: scroll;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 15px;
    /* or 94% */

    text-transform: uppercase;

    /* black */

    color: #000000;
`

const WhiteArtist = styled.div`
    /* H6 */

    position: absolute;
    width: 114px;
    height: 37px;
    left: 0px;
    top: 0px;

    /* H6 */

    font-family: 'Druk Cyr';

    font-weight: 700;
    font-size: 70px;
    line-height: 101.8%;
    /* identical to box height, or 37px */
    white-space: nowrap;

    letter-spacing: 0.01em;
    text-transform: uppercase;

    color: #FFFFFF;
`

const WhiteName = styled.div`

    /* Caption small */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    /* identical to box height, or 112% */
    overflow-x: scroll;

    text-transform: uppercase;
    line-height: 26px;

    /* black */

    color: #FFFFFF;
`

const WhiteDescription = styled.div`
    width: 94px;
    height: 16px;

    /* caption very small */

    font-family: 'Graphik LCG Regular';
    overflow-x: scroll;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 8px;
    /* or 94% */

    text-transform: uppercase;

    /* black */

    color: #FFFFFF;
`