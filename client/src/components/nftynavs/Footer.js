import React from "react";
import {
Box,
TitleNfty,
DescriptionNfty,
FollowUs,
Twitter,
Reddit,
Instagram,
Discord,
Socials,
Icons,
Container,
Column,
FooterLink,
Heading,
} from "./FooterStyles";
import discord from '../../assets/images/discordWhite.png'
import instagram from "../../assets/images/igWhite.png";
import twitter from '../../assets/images/twitterWhite.png'
import reddit from "../../assets/images/redditWhite.png";


import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
function FooterPage() {
return (
	<Box>
		<TitleNfty>
			NftyTunes
		</TitleNfty>
		<DescriptionNfty>Experience and trade audiovisual NFTs from your favorite artists </DescriptionNfty>
		<FollowUs>Follow Us</FollowUs>
		<Socials>
			<Row>
				<Col style={{marginRight: "15px"}}>
					<a href="https://twitter.com/nftytunes">
						<Twitter src={twitter}/>
					</a>
				</Col>
				<Col style={{marginRight: "15px"}}>
					<a href="discord.gg/2Yrm7Z7jeV">
					<Discord src={discord}/>
					</a>
				</Col>
				<Col style={{marginRight: "15px"}}>

					<Reddit src={reddit}/>
				</Col>
				<Col style={{marginRight: "15px"}}>
					<a href="https://www.instagram.com/nftytunes/">
					<Instagram src={instagram}/>
					</a>
				</Col>
			</Row>
		</Socials>

	
	</Box>
);
};
export default FooterPage;



