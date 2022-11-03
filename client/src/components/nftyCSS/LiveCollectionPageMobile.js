import styled from 'styled-components'
import rightarrow from "../../assets/images/rightarrow.png"

import leftarrow from "../../assets/images/leftarrow.png"

export const HeaderSection = styled.div `
    background-color: black;
    height: 1674px;
    width: 100vw;
`;


export const Shade = styled.div`
position: absolute;
width: 312px;
overflow: hidden;
height: 377px;
left: 30px;
top: 154px;
z-index: -1;

background: radial-gradient(52.1% 60.93% at 50.56% 43.61%, #8DFDFF 35.15%, #000000 91.54%);
`

export const InfoSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 29px;

position: absolute;
width: 340px;
height: 337px;
left: 18px;
top: 440px;

z-index: 3;
`

export const TitleLocation = styled.div`
width: 340px;
height: 190px;

/* H3 */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 700;
font-size: 30px;
line-height: 35px;
/* or 108% */

letter-spacing: -0.03em;
text-transform: uppercase;

color: #FFFFFF;

`

export const DescriptionLocation = styled.div`
width: 323px;
height: 168px;

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
align-items:center;
padding: 0px;
gap: 40px;

position: absolute;
width: 357px;
height: 801px;
left: 18px;
top: 837px;


`

export const TiersTitle = styled.div`
width: 133px;
height: 100px;

/* H2 */

font-family: 'Druk Cyr';

font-weight: 900;
font-size: 50px;
line-height: 57px;
/* identical to box height, or 91% */

text-transform: uppercase;

color: #FFFFFF;
/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
`

export const AuctionCard = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 8px;

width: 330px;
height: 704px;

`

export const ArrowField = styled.div`

display: flex;
flex-direction: row;
align-items: flex-start;
position: absolute;
padding: 0px;
gap: 10px;

margin-left: 200px;
margin-top: -10px;

width: 90px;
height: 40px;



`

export const LeftArrowButton = styled.button`
box-sizing: border-box;

/* Auto layout */

gap: 10px;

width: 40px;
height: 40px;


/* white_transparent */

border: 1px solid rgba(255, 255, 255, 0.5);
border-radius: 32px;

`

export const RightArrowButton = styled.button`
border: none;
background: transparent;

`

export const LeftArrow = styled.img`

box-sizing: border-box;

/* Auto layout */

gap: 10px;

width: 40px;
height: 40px;


/* white_transparent */

border: 1px solid rgba(255, 255, 255, 0.5);
border-radius: 32px;

`

export const RightArrow = styled.img`
box-sizing: border-box;

/* Auto layout */


gap: 10px;

width: 40px;
height: 40px;

/* white */

background: #FFFFFF;
/* white */

border: 1px solid #FFFFFF;
border-radius: 32px;
`




export const TiersGap = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 170px;

width: 337px;
height: 57px;
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
top: 385px;
left: 190px;
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