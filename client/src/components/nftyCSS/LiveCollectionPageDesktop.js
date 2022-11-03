import styled from 'styled-components'

export const HeaderSection = styled.div `
    background-color: black;
    height: 2305px;
`;


export const Shade = styled.div`
position: absolute;
width: 100%;
height: 760px;
left: 0px;
top: 250px;
z-index: 0;
background: radial-gradient(52.1% 60.93% at 50.56% 43.61%, #8DFDFF 35.15%, #000000 91.54%);

`

export const InfoSection = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 29px;

position: absolute;
width: 1290px;
height: 260px;
left: calc(50% - 1290px/2);
top: 986px;
z-index: 3;
`

export const TitleLocation = styled.div`
width: 743px;
height: 260px;

/* H3 */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 700;
font-size: 60px;
line-height: 65px;
/* or 108% */

letter-spacing: -0.03em;
text-transform: uppercase;

color: #FFFFFF;

`

export const DescriptionLocation = styled.div`
width: 518px;
height: 120px;

/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 24px;
/* or 133% */


/* white */

color: #FFFFFF;
`

export const TierBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 70px;

position: absolute;
width: 1300px;
height: 821px;
left: calc(50% - 1300px/2);
top: 1335px;

`

export const TiersTitle = styled.div`
width: 133px;
height: 100px;

/* H2 */

font-family: 'Druk Cyr';

font-weight: 900;
font-size: 110px;
line-height: 100px;
/* identical to box height, or 91% */

text-transform: uppercase;

color: #FFFFFF;
`

export const AuctionCard = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 8px;


width: 420px;
height: 696px;

`



export const ArtistOwnerSubSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 13px;

position: absolute;

width: 152px;
height: 43px;
top: 915px;
left: calc(50% - 152px/2 + 510px);
z-index: 2;

`

export const ArtistOwnerBox = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 152px;
height: 43px;
`

export const ArtistOwnerSubBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

width: 96px;
height: 28px;
`

export const ArtistOwnerPhoto = styled.img`
width: 43px;
height: 43px;

border-radius: 153px;
`

export const ArtistOwner = styled.div`

width: 28px;
height: 8px;

/* caption very small */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 8px;
line-height: 8px;
/* identical to box height, or 94% */

text-transform: uppercase;

/* black */

color: #FFFFFF;
`

export const ArtistOwnerName = styled.div`
width: 96px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
white-space: nowrap;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

color: #FFFFFF;
`