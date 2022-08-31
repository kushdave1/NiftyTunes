import React from "react";
import {
Box,
Container,
Column,
FooterLink,
Heading,
} from "./FooterStyles";
import nftyimg from "../../assets/images/NT_White_Isotype.png";
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
function FooterPage() {
return (
	<Box>
	<Container fluid>
		{/* <Row>
		<Column>
			<Heading>About Us</Heading>
			<FooterLink href="#">Aim</FooterLink>
			<FooterLink href="#">Vision</FooterLink>
			<FooterLink href="#">Testimonials</FooterLink>
		</Column>
		<Column>
			<Heading>Services</Heading>
			<FooterLink href="#">Writing</FooterLink>
			<FooterLink href="#">Internships</FooterLink>
			<FooterLink href="#">Coding</FooterLink>
			<FooterLink href="#">Teaching</FooterLink>
		</Column>
		<Column>
			<Heading>Contact Us</Heading>
			<FooterLink href="#">Uttar Pradesh</FooterLink>
			<FooterLink href="#">Ahemdabad</FooterLink>
			<FooterLink href="#">Indore</FooterLink>
			<FooterLink href="#">Mumbai</FooterLink>
		</Column>
		<Column>
			<Heading>Social Media</Heading>
			<FooterLink href="#">
			<i className="fab fa-facebook-f">
				<span>
				Facebook
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-instagram">
				<span>
				Instagram
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-twitter">
				<span>
				Twitter
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-youtube">
				<span>
				Youtube
				</span>
			</i>
			</FooterLink>
            
		</Column>


		</Row> */}
	</Container>
	<center>
    <img height="100" width="100" src={nftyimg}></img>
	
	
			<Row className="pt-5 align-self-right">
				<Col >
					<a href="http://twitter.com/nftytunes" style={{padding: "1rem"}}>
						<i class="bi bi-twitter" style={{fontSize: "2rem", color: "cornflowerblue"}}></i>
					</a>
				
					<a href="https://discord.gg/hYdz34KF" style={{padding: "1rem"}}>
						<i class="bi bi-discord" style={{fontSize: "2rem", color: "#7289DA"}}></i>
					</a>
				
					<a href="https://www.reddit.com/user/nftytunes" style={{padding: "1rem"}}>
						<i class="bi bi-reddit" style={{fontSize: "2rem", color: "#FF5700"}}></i>
					</a>
				
					<a href="https://www.instagram.com/nftytunes/" style={{padding: "1rem"}}>
						<i class="bi bi-instagram" style={{fontSize: "2rem", color: "#8a3ab9"}}></i>
					</a>
				</Col>
	
			</Row>
	</center>		
	</Box>
);
};
export default FooterPage;
