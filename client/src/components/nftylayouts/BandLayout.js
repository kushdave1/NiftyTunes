import styled from 'styled-components'
import legendaryseal from '../../assets/images/legendaryseal.png'
import legendaryband from '../../assets/images/legendaryband.png'
import rareseal from '../../assets/images/rareseal.png'
import commonseal from '../../assets/images/commonseal.png'
import Row from 'react-bootstrap/Row'

function BandLayout({nft}) {
    return (
        <>
        {(nft.name.includes("gold") || nft.name.includes("Gold")) ? 
        (
        <WristBand>
            <Seal src={legendaryseal}></Seal>
            <LegendaryBand>
                <BandArtistLayout>
                    
                    <Row className="py-0">
                        <BlackArtist>
                        {nft.artistName}
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
                    
                    <Row className="py-0">
                        <WhiteArtist>
                        {nft.artistName}
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
                    
                    <Row className="py-0">
                        <BlackArtist>
                        {nft.artistName}
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
            </CommonBand>
        </WristBand>
        )
    }
        
        </>
    )
}

export default BandLayout

const NoWrap = styled.div`
    white-space: nowrap;
`

const WristBand = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;

    width: 310px;
    height: 76px;
`

const Seal = styled.img`
    width: 138px;
    height: 76px;
`

const LegendaryBand = styled.div`
    width: 172px;
    height: 76px;
    background-image: url(${legendaryband});
`

const RareBand = styled.div`
    width: 172px;
    height: 76px;
    background-color: #FD4758;
`

const CommonBand = styled.div`
    width: 172px;
    height: 76px;
    background-color: #EDCF92;
`

const BandArtistLayout = styled.div`
    left: 3.95%;
    right: 0%;
    top: 0%;
    bottom: 1.39%;
    margin-left: 5px;
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

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 700;
    font-size: 36px;
    /* identical to box height, or 37px */
    overflow-x: scroll;

    letter-spacing: 0.01em;
    text-transform: uppercase;
    line-height: 101.8%;
    /* black */

    color: #000000;
`

const BlackName = styled.div`

    /* Caption small */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    /* identical to box height, or 112% */
    overflow-x: scroll;

    text-transform: uppercase;
    line-height: 18px;

    /* black */

    color: #000000;
`

const BlackDescription = styled.div`
    width: 94px;
    height: 16px;

    /* caption very small */

    font-family: 'Graphik LCG Regular';
    overflow-x: scroll;
    font-style: normal;
    font-weight: 500;
    font-size: 8px;
    line-height: 8px;
    /* or 94% */

    text-transform: uppercase;

    /* black */

    color: #000000;
`

const WhiteArtist = styled.div`
    /* H6 */

    font-family: 'Druk Cyr';
    font-style: italic;
    font-weight: 700;
    font-size: 36px;
    /* identical to box height, or 37px */
    overflow-x: scroll;

    letter-spacing: 0.01em;
    text-transform: uppercase;
    line-height: 101.8%;
    /* black */

    color: #FFFFFF;
`

const WhiteName = styled.div`

    /* Caption small */

    font-family: 'Graphik LCG Regular';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    /* identical to box height, or 112% */
    overflow-x: scroll;

    text-transform: uppercase;
    line-height: 18px;

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
    font-size: 8px;
    line-height: 8px;
    /* or 94% */

    text-transform: uppercase;

    /* black */

    color: #FFFFFF;
`