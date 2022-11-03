import styled from 'styled-components';

export const Box = styled.div`
	position: absolute;
	width: 100%;
	height: 160px;

	background: #000000;
	line-height: 160px;
`;

export const TitleNfty = styled.div`
position: absolute;
font-family: 'Druk Cyr';
font-style: normal;
font-weight: 900;
font-size: 60px;

/* or 95% */

width: 159px;
height: 49px;
left: 60px;

text-transform: uppercase;
color: white;
`

export const DescriptionNfty = styled.div`

position: absolute;
width: 309px;
height: 48px;
left: 279px;
top: 60px;

/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
/* or 133% */


color: #FFFFFF;
`

export const FollowUs = styled.div`
position: absolute;
width: 94px;
height: 18px;
right: 192px;

top: 56px;

/* Caption small */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

color: #FFFFFF;
`

export const Socials = styled.div`
display: flex;
flex-direction: row;
padding: 0px;
column-gap: 50px;

position: absolute;
right: 154px;
top: 84px;
`

export const Icons = styled.img`
width: 18px;
height: 18px;
flex: none;
order: 0;
flex-grow: 0;
`


export const Twitter = styled(Icons)`
position: absolute;

`

export const Reddit = styled(Icons)`
position: absolute;

`


export const Discord = styled(Icons)`
position: absolute;

`

export const Instagram = styled(Icons)`

position: absolute;

`




export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 1000px;
	margin: 0 auto;
	/* background: red; */
`

export const Column = styled.div`
display: flex;
flex-direction: column;
text-align: left;
margin-left: 60px;
line-height: 0.5;
`;

export const Row = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill,
						minmax(185px, 1fr));
grid-gap: 20px;

@media (max-width: 1000px) {
	grid-template-columns: repeat(auto-fill,
						minmax(200px, 1fr));
}
`;

export const FooterLink = styled.a`
color: #fff;
margin-bottom: 20px;
font-size: 18px;
text-decoration: none;

&:hover {
	color: green;
	transition: 200ms ease-in;
}
`;

export const Heading = styled.p`
font-size: 24px;
color: #fff;
margin-bottom: 40px;
font-weight: bold;
`;
