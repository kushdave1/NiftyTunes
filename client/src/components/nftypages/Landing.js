import React, { useState, useEffect } from 'react'

import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Carousel from 'react-bootstrap/Carousel'
import ProductListLayout from '../nftylayouts/ProductListLayout'
import Banner from '../../assets/images/bannerOne.jpeg';
import {useNavigate} from 'react-router'
import ContactModal from '../nftyModals/ProfileModals/ContactModal'

import MarketplaceGroup from '../../assets/images/MarketplaceGroup.png'
import LoopsGroup from '../../assets/images/LoopsGroup.png'

import GroupOne from "../../assets/images/Group 1.png"
import GroupTwo from "../../assets/images/Group 2.png"
import Moralis from 'moralis';
import { useMoralis } from 'react-moralis'

import LiveMintingLanding from "../../assets/images/LiveMintingLanding.png"
import NftyLoopsLanding from "../../assets/images/NftyLoopsLanding.png"
import MarketplaceLanding from "../../assets/images/MarketplaceLanding.png"

import img from "../../assets/images/firelips.png";
import Ellipse52 from "../../assets/images/Ellipse 52.png"
import animation from "../../assets/images/loop animation_1.gif"
import nftyimgwhite from "../../assets/images/NT_White_Isotype.png"
import kush from "../../assets/images/kush2.jpg"
import nftyimg from "../../assets/images/NT_Black_2.png";
import nftyimgtwo from "../../assets/images/nt_blur.png";
import livemint from "../../assets/images/livemint2.png";
import downarrow from "../../assets/images/downarrow3.png"
import ConnectButton from '../nftynavs/ConnectButton'
import ExploreButton from '../nftynavs/ExploreButton'

import CollectionImage from '../nftymix/CollectionImageLanding'
import * as Desktop from '../nftyCSS/LandingDesktop'
import * as Mobile from '../nftyCSS/LandingMobile'

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..


function Landing() {
    AOS.init();
    const {authenticate, isAuthenticated, isAuthenticating, hasAuthError, authError, user, logout, account} = useMoralis();

    const [show, setShow] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false)

    const [width, setWindowWidth] = useState()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowContactModal = () => setShowContactModal(true);
    const handleCloseContactModal = () => setShowContactModal(false);

    let navigate = useNavigate();
    
    useEffect(async() => {

        updateDimensions();
        if (!isAuthenticated) {
            try {
            await authenticate({
                signingMessage: "Welcome to Nftytunes. Please sign to log in.",
                onSuccess: () => navigate('/')
            })

        } catch {
            console.log("hi")
            await Moralis.enableWeb3({ provider: "walletconnect" })
        }
        }
        

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
    <React.Fragment>
    {(responsive.showTopNavMenu) ? (
        <>
        <Desktop.HeaderSection>
            <Desktop.CollectDigitalVibes data-aos="fade-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000"
    >Collect<br/>Digital Vibes</Desktop.CollectDigitalVibes>
            <Desktop.SubHeaderText>Experience and trade audiovisual NFTs from your favorite artists</Desktop.SubHeaderText>
            <Desktop.StartCollecting onClick={()=> navigate('/live')}>Start Collecting</Desktop.StartCollecting>
            <Desktop.HeaderAnimation src={animation}></Desktop.HeaderAnimation>
            <Desktop.Rectangle1>
            </Desktop.Rectangle1>
            <Desktop.Group1 src={GroupOne} />

            <Desktop.HeaderTwo data-aos="fade-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Made by Artists, <br/>For Artists</Desktop.HeaderTwo>
            <Desktop.HeaderTwoCaption>Our live minting protocol is making live experiences timeless. 
                Not only are we empowering artists to create a direct one to one connection with their fans, 
                but we are also bringing them new revenue streams.</Desktop.HeaderTwoCaption>
            <Desktop.LiveNFTButton onClick={()=>navigate('/contact-us')}>Get in Touch</Desktop.LiveNFTButton>
            <Desktop.Group2 src={GroupTwo} />
            <Desktop.HeaderThree data-aos="fade-right"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Live Minting</Desktop.HeaderThree>
            <Desktop.HeaderThreeCaption>An interactive, immersive, and innovative way to capture experiences on-chain. 
                Whether you experience the moment IRL or via live stream - these moments now live forever.</Desktop.HeaderThreeCaption>
            <Desktop.NftytunesLive onClick={()=>navigate("/live")}>Nftytunes Live</Desktop.NftytunesLive>
            <Desktop.HeaderFour data-aos="fade-left"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Marketplace</Desktop.HeaderFour>
            <Desktop.HeaderFourCaption>Our marketplace is for artists, musicians, the crypto curious, and those looking to learn something new. 
                Experience, buy, sell, create, repeat.</Desktop.HeaderFourCaption>
            <Desktop.MarketplaceButton onClick={()=>navigate("/marketplace")}>Explore</Desktop.MarketplaceButton>
            <Desktop.ComingSoon data-aos="fade-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Coming Soon</Desktop.ComingSoon>
            <Desktop.HeaderFive data-aos="fade-up"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Nfty Loops</Desktop.HeaderFive>
            <Desktop.HeaderFiveCaption>At NftyTunes, you are the creator. Made by artists, 
                for artists, our platform allows you to build unique and personalized NFTs 
                using your favorite art + music.</Desktop.HeaderFiveCaption>
            <Desktop.MarketplaceGroupImage src={MarketplaceGroup} />
            <Desktop.LoopsGroupImage src={LoopsGroup} />
            
                
                
        </Desktop.HeaderSection>
        </>
    ) : (
       <>
        <Mobile.HeaderSection>
        
                <Mobile.CollectDigitalVibes className="shadow-md"
        data-aos="fade-in"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Collect<br/>Digital Vibes</Mobile.CollectDigitalVibes>
                <Mobile.SubHeaderText>Experience and trade audiovisual NFTs from your favorite artists</Mobile.SubHeaderText>
                <Mobile.StartCollecting className="shadow-md"
        data-aos="fade-in"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000" onClick={()=> navigate('/live')}>Start Collecting</Mobile.StartCollecting>
                <Mobile.HeaderAnimation src={animation}></Mobile.HeaderAnimation>
                <Mobile.Rectangle1>
                </Mobile.Rectangle1>
                <Mobile.Group1 src={GroupOne} />

                <Mobile.HeaderTwo className="shadow-md"
        data-aos="fade-in"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Made by Artists, <br/>For Artists</Mobile.HeaderTwo>
                <Mobile.HeaderTwoCaption>Our live minting protocol is making live experiences timeless. 
                    Not only are we empowering artists to create a direct one to one connection with their fans, 
                    but we are also bringing them new revenue streams.</Mobile.HeaderTwoCaption>
                <Mobile.LiveNFTButton onClick={()=>navigate('/contact-us')}>Get in Touch</Mobile.LiveNFTButton>
                <Mobile.Group2 src={GroupTwo} />
                <Mobile.HeaderThree className="shadow-md"
        data-aos="fade-in"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000">Live Minting</Mobile.HeaderThree>
                <Mobile.HeaderThreeCaption>An interactive, immersive, and innovative way to capture experiences on-chain. 
                    Whether you experience the moment IRL or via live stream - these moments now live forever.</Mobile.HeaderThreeCaption>
                <Mobile.NftytunesLive className="shadow-md"
        data-aos="fade-in"
    data-aos-offset="200"
    data-aos-delay="50"
    data-aos-duration="1000" onClick={()=>navigate("/live")}>Nftytunes Live</Mobile.NftytunesLive>
                <Mobile.HeaderFour>Marketplace</Mobile.HeaderFour>
                <Mobile.HeaderFourCaption>Our marketplace is for artists, musicians, the crypto curious, and those looking to learn something new. 
                    Experience, buy, sell, create, repeat.</Mobile.HeaderFourCaption>
                <Mobile.MarketplaceButton onClick={()=>navigate("/marketplace")}>Explore</Mobile.MarketplaceButton>
                <Mobile.ComingSoon >Coming Soon</Mobile.ComingSoon>
                <Mobile.HeaderFive>Nfty Loops</Mobile.HeaderFive>
                <Mobile.HeaderFiveCaption>At NftyTunes, you are the creator. Made by artists, 
                    for artists, our platform allows you to build unique and personalized NFTs 
                    using your favorite art + music.</Mobile.HeaderFiveCaption>
                <Mobile.MarketplaceGroupImage src={MarketplaceGroup} />
                <Mobile.LoopsGroupImage src={LoopsGroup} />
            
        </Mobile.HeaderSection>
        </>
    )}
            
    </React.Fragment>
        
    )
}

export default Landing







   
