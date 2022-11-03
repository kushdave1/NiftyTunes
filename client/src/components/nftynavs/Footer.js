import { useState, useEffect } from "react";
import * as Desktop from "../nftyCSS/FooterDesktop";
import * as Mobile from '../nftyCSS/FooterMobile'
import discord from '../../assets/images/discordWhite.png'
import instagram from "../../assets/images/igWhite.png";
import twitter from '../../assets/images/twitterWhite.png'
import reddit from "../../assets/images/redditWhite.png";


import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
function FooterPage() {

	const [width, setWindowWidth] = useState()

	useEffect(() => {

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize",updateDimensions);

    }, [])

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }

	return (
		<>
		{(responsive.showTopNavMenu) ? (
			<Desktop.Box>
			<Desktop.TitleNfty>
				NftyTunes
			</Desktop.TitleNfty>
			<Desktop.DescriptionNfty>Experience and trade audiovisual NFTs from your favorite artists </Desktop.DescriptionNfty>
			<Desktop.FollowUs>Follow Us</Desktop.FollowUs>
			<Desktop.Socials>
				<Row>
					<Col style={{marginRight: "15px"}}>
						<a href="https://twitter.com/nftytunes">
							<Desktop.Twitter src={twitter}/>
						</a>
					</Col>
					<Col style={{marginRight: "15px"}}>
						<a href="discord.gg/2Yrm7Z7jeV">
						<Desktop.Discord src={discord}/>
						</a>
					</Col>
					<Col style={{marginRight: "15px"}}>

						<Desktop.Reddit src={reddit}/>
					</Col>
					<Col style={{marginRight: "15px"}}>
						<a href="https://www.instagram.com/nftytunes/">
						<Desktop.Instagram src={instagram}/>
						</a>
					</Col>
				</Row>
			</Desktop.Socials>

		
		</Desktop.Box>
		) : (
			<Mobile.Box>
				<Mobile.TitleNfty>
					NftyTunes
				</Mobile.TitleNfty>
				<Mobile.DescriptionNfty>
					Experience and trade audiovisual NFTs from your favorite artists
				</Mobile.DescriptionNfty>
				<Mobile.FollowUs>Follow Us</Mobile.FollowUs>
				<Mobile.Socials>
					<Row style={{display: "flex", gap: "16px"}}>
						<Col >
							<a href="https://twitter.com/nftytunes">
								<Desktop.Twitter src={twitter}/>
							</a>
						</Col>
						<Col >
							<a href="discord.gg/2Yrm7Z7jeV">
							<Desktop.Discord src={discord}/>
							</a>
						</Col>
						<Col >
							<a href="https://www.reddit.com/r/nftytunes/">
								<Desktop.Reddit src={reddit}/>
							</a>
						</Col>
						<Col >
							<a href="https://www.instagram.com/nftytunes/">
							<Desktop.Instagram src={instagram}/>
							</a>
						</Col>
					</Row>

				</Mobile.Socials>
				{/* <Mobile.SubBox>
					<Mobile.TitleBox>

					</Mobile.TitleBox>
				</Mobile.SubBox> */}



			
			</Mobile.Box>
		)}
		</>
		
	);
};
export default FooterPage;



