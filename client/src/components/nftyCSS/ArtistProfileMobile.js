import styled from 'styled-components'
import Nav from 'react-bootstrap/Nav'

export const ProfileSection = styled.div`
position: relative;
width: 100%;
min-height: 1709px;
height: 1px;
/* pink */
overflow-y: scroll;
overflow-x: hidden;

background: #F6A2B1;
`

export const ProfileBanner = styled.img`
position: absolute;
width: 100%;
height: 170px;
left: 0px;

`

export const ProfileSubSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 60px;

position: absolute;
width: 340px;
height: 427px;
left: calc(50% - 1300px/2);
top: 150px;

`

export const ProfileTopSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 20px;

position: absolute;
width: 314px;
height: 398px;
left: 18px;
top: 130px;
`

export const ArtistInfoSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 30px;

width: 340px;
height: 336px;
`

export const ArtistText = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 340px;
height: 282px;
`

export const NFTSection = styled.div `
    display: flex;
    flex-direction: column;
    padding: 0px;
    gap: 40px;

    width: 1300px;
    height: 964px;
`;



export const ProfilePhoto = styled.img`
width: 92px;
height: 89px;

border-radius: 153px;
`

export const ArtistDescription = styled.div`

width: 314px;
height: 168px;

/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 24px;
/* or 133% */


/* black */

color: #000000;
`

export const BannerPhoto = styled.img`
width: 640px;
height: 460px;
`




export const ProfileNameEtherscan = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 50px;

width: 303px;
height: 57px;
`

export const ProfileName = styled.div`
width: 154px;
height: 57px;

/* H5 */

font-family: 'Druk Cyr';
font-style: italic;
font-weight: 700;
font-size: 50px;
line-height: 57px;
/* identical to box height */
white-space: nowrap;
text-transform: uppercase;

color: #000000;
`

export const Etherscan = styled.button`
display: flex;
flex-direction: row;
align-items: center;
padding: 18px 20px;
gap: 20px;
margin-left: 30px;
width: 124px;
height: 40px;

/* white_transparent */

background: rgba(255, 255, 255, 0.5);
border-radius: 10px;
`

export const EtherscanText = styled.div`
width: 84px;
height: 15px;

font-family: 'Inter';
font-style: normal;
font-weight: 600;
font-size: 12px;
line-height: 15px;
/* identical to box height */

text-align: center;
letter-spacing: 0.04em;

color: rgba(0, 0, 0, 0.7);
`

export const EditProfile = styled.button`
box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

width: 136px;
height: 44px;

border: 2px solid #000000;
border-radius: 30px;
`

export const EditProfileText = styled.div`
width: 84px;
height: 16px;

/* button_text */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
white-space: nowrap;
/* identical to box height */


color: #000000;
`

export const ProfileNav = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-start;
padding: 0px;
gap: 70px;

position: absolute;
width: 340px;
height: 18px;
left: calc(50% - 340px/2 + 0.5px);
top: 608px;
`

export const NavSelect = styled.div`
width: 340px;
height: 37px;

`

export const NavBarSelect = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 30px;

width: 432px;
height: 15px;
left: 0px;
top: 0px;

`

export const HoverItem = styled(Nav.Item)`
    &:hover {
        // border-bottom: 3px solid black;
        color: black !important;
    }
`

export const NFTSubSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 50px;

    width: 340px;
    height: 878px;
`

