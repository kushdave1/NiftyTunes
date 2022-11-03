import styled from 'styled-components'

export const ProfileEditSection = styled.div`

position: relative;
width: 100%;
height: 1458px;

background: #F6A2B1;
`

export const ProfileEditSubSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 60px;

position: absolute;
width: 950px;
height: 1006px;
left: calc(50% - 950px/2 + 100px);
top: 150px;
`


export const EditProfile = styled.div`
width: 296px;
height: 100px;

/* H2 */

white-space: nowrap;
font-family: 'Druk Cyr';

font-weight: 900;
font-size: 110px;
line-height: 100px;
/* identical to box height, or 91% */

text-transform: uppercase;

color: #000000;
`

export const ProfileForm = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 60px;

width: 640px;
height: 846px;
`

export const ProfileSubSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 40px;

width: 640px;
height: 742px;


`

export const ProfilePicSection = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 279px;
height: 124px;
`

export const ProPic = styled.img`
width: 90px;
height: 90px;
border-radius: 80px;
`


export const UploadForm = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 36px;

width: 169px;
height: 124px;
`

export const ProfilePictureLabel = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 12px;

width: 169px;
height: 46px;

`

export const ProPicText = styled.div`
width: 137px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

color: rgba(0, 0, 0, 0.5);
`

export const FileSizeRequirements = styled.div`
width: 169px;
height: 16px;

/* small text */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 16px;
/* identical to box height, or 114% */


color: rgba(0, 0, 0, 0.5);

`

export const UploadButton = styled.button`
box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 13px 30px;
gap: 10px;

width: 167px;
height: 42px;

border: 1px solid #000000;
border-radius: 30px;
`

export const UploadText = styled.div`
width: 107px;
height: 16px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */


color: #000000;
`

export const BioForm= styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 24px;

width: 640px;
height: 578px;

`

export const BioGroup = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 10px;

width: 640px;
height: 72px;

`

export const BioSubGroup = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 8px;

width: 640px;
height: 72px;

`

export const BioLabelRow = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 14px;

width: 640px;
height: 18px;
`

export const BioLabel= styled.div`
width: 89px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

/* black */

color: #000000;
`

export const BioInput = styled.input`
/* Auto layout */

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 11px 18px;
gap: 10px;

width: 640px;
height: 46px;

background: #F5F5F5;
border-radius: 30px;
`

export const BioInputLarge = styled.input`
/* Auto layout */

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 11px 18px;
gap: 10px;

width: 640px;
height: 72px;

background: #F5F5F5;
border-radius: 10px;
`


export const BioTextField = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 14px;

width: 604px;
height: 24px;

`

export const UploadInput = styled.input`

position: absolute;
margin-top: 60px;

`

export const SaveButton = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

width: 159px;
height: 44px;

background: #000000;
border-radius: 30px;
`

export const SaveText = styled.div`
width: 107px;
height: 16px;

/* button_text */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */
white-space: nowrap;

color: #FFFFFF;
`