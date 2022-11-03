//react
import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Routes, 
    Route, 
    Link,
    Outlet
} from "react-router-dom"

import { useMoralisQuery } from "react-moralis";
import { fetchArtistName, fetchArtistPhoto, fetchArtistInfo } from "../nftyFunctions/fetchCloudData"
import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router'
import { useMoralisFile } from "react-moralis";
import ProfileInfo from '../nftyModals/ProfileModals/ProfileInfo'
import ProfileSocials from '../nftyModals/ProfileModals/ProfileSocials'
import profilebanner from '../../assets/images/profilebanner.png'
import * as Desktop from '../nftyCSS/ArtistProfileDesktop'
import * as Mobile from '../nftyCSS/ArtistProfileMobile'


//bootstrap
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/FormGroup'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { Tooltip, Spin, Input } from "antd";

import link from '../../assets/images/link.png'


//components
import MyNFTs from '../nftyprofiles/MyNFTs'
import DefaultProfilePicture from '../../assets/images/gorilla.png';
import Banner from '../../assets/images/bannerOne.jpeg';
import { changeBackgroundWhite, changeBackgroundBlack } from "../nftyFunctions/hover"
import { CheckUserRole, SignUpUser } from "../nftyFunctions/SignUpRole"

import nftyimg from '../../assets/images/NT_White_Isotype.png'

//moralis
import Moralis from 'moralis'
import { useMoralis } from 'react-moralis'
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import MyListedNFTs from 'components/nftyprofiles/MyListedNFTs'
import { APP_ID, SERVER_URL } from '../../index'



const HeaderSection = styled.div `
    margin:0;
    position:absolute;
    top:50%;
    left:10%;
    -ms-transform: translate-Y(-40%);
    transform: translateY(-40%);
    min-height: 100vh;
`;

const ProfileNavSection = styled.div `
    background-color: white;
`;

const ProfilePic = styled.div `
`



function ArtistProfile() {
    const {isAuthenticated, user} = useMoralis();
    const [key, setKey] = useState("onsale")

    const { ethAddress } = useParams();

    const [address, setAddress] = useState('');
    const [width, setWindowWidth] = useState()
    const [username, setUsername] = useState('');
    const [artistType, setArtistType] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [usernameEntered, setUsernameEntered] = useState('');
    const [etherscan, setEtherscan] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionEntered, setDescriptionEntered] = useState('');
    const [artistTypeEntered, setArtistTypeEntered] = useState('');
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [fileTarget, setFileTarget] = useState("");
    const [bannerFileTarget, setBannerFileTarget] = useState("");


    const [twitter, setTwitter] = useState('');
    const [twitterEntered, setTwitterEntered] = useState('');
    const [instagram, setInstagram] = useState('');
    const [instagramEntered, setInstagramEntered] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [tiktokEntered, setTiktokEntered] = useState('');
    const [discord, setDiscord] = useState('');
    const [discordEntered, setDiscordEntered] = useState('');


    const { saveFile } = useMoralisFile();

    const { chainId, marketAddress, marketContractABI, nftyLazyFactoryAddress, nftyLazyContractABI } = useMoralisDapp();

    const marketContractABIJson = JSON.parse(marketContractABI);
    const nftyLazyContractABIJson = JSON.parse(nftyLazyContractABI);

    const [show, setShow] = useState(false);
    const [minterShow, setMinterShow] = useState(false);
    const [socialsShow, setSocialsShow] = useState(false);


    const handleMinterClose = () => setMinterShow(false);
    const handleMinterShow = () => setMinterShow(true);

    const handleSocialsClose = () => setSocialsShow(false);
    const handleSocialsShow = () => setSocialsShow(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    Moralis.start({ serverUrl, appId});

    const { fetch } = useMoralisQuery(
        "_User",
        (query) => query.equalTo("ethAddress", ethAddress),
        [],
        { autoFetch: false }
    );


    

    useEffect(async() => {

        const object = await fetchArtistInfo(ethAddress);
        //const object = results[0]

        console.log(object.get("username"), "SYNA")


        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        setAddress(object.get('ethAddress'));
        setUsername(object.get('username'));
        setDescription(object.get('description'))
        setArtistType(object.get('artistType'));
        setProfilePhoto(object.get('profilePhotoURL'))
        setBannerPhoto(object.get('bannerPhotoURL'))

        setTwitter(object.get('twitter'));
        setInstagram(object.get('instagram'));
        setDiscord(object.get('discord'))
        setTiktok(object.get('tiktok'));

        setEtherscan(`https://etherscan.io/address/${address}`)

        // if (artistType !== "Collector" && await CheckUserRole(nftyLazyFactoryAddress, nftyLazyContractABIJson) === false) {
        //     handleMinterShow()
        // }
        return () => window.removeEventListener("resize",updateDimensions);
    }, [user]);

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }
    
    let navigate = useNavigate()


    return (
        <React.Fragment>
        
        {(responsive.showTopNavMenu) ? (
            <Desktop.ProfileSection>
                <Desktop.ProfileSubSection>
                    <Desktop.ProfileTopSection>
                        <Desktop.ArtistInfoSection>
                            <Desktop.ArtistText>
                                {(profilePhoto) ? (<Desktop.ProfilePhoto src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : 
                                (<Desktop.ProfilePhoto src={DefaultProfilePicture}/>)}
                                <Desktop.ProfileName>{(username.length.toString() === "25") ? (<>Unnamed</>) : (<>{username}</>)}</Desktop.ProfileName>
                                <Desktop.ArtistDescription>
                                    {description}
                                </Desktop.ArtistDescription>
                            </Desktop.ArtistText>
                        </Desktop.ArtistInfoSection>
                        {(bannerPhoto) ? (<Desktop.BannerPhoto src={bannerPhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>):
                        (<Desktop.BannerPhoto src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>)}
                    </Desktop.ProfileTopSection>
                    <Desktop.ProfileNav>
                        <Desktop.NavSelect>
                            <Desktop.NavBarSelect>
                                <Nav className="justify-content-left nav-tabs" variant="pills" style={{width: "100%"}} onSelect={(k) => setKey(k)} 
                                style={{borderColor: "rgba(0, 0, 0, 0.3)"}} defaultActiveKey="items">
                                    <Desktop.HoverItem>
                                        <Nav.Link className="profile" as={Link} eventKey="items" style={{color: "rgba(0, 0, 0, 0.3)"}} to="items">
                                            Items
                                        </Nav.Link>
                                    </Desktop.HoverItem>
                                    
                                </Nav>
                            </Desktop.NavBarSelect>
                        </Desktop.NavSelect>
                        <Desktop.NFTSection >
                            <Desktop.NFTSubSection>
                                <Outlet />
                            </Desktop.NFTSubSection>
                        </Desktop.NFTSection>
                    </Desktop.ProfileNav>
                </Desktop.ProfileSubSection>
            </Desktop.ProfileSection>
        ) : (
            <>
            <Mobile.ProfileSection>
                <Mobile.ProfileTopSection>
                            {(profilePhoto) ? (<Mobile.ProfilePhoto src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : 
                            (<Mobile.ProfilePhoto src={DefaultProfilePicture}/>)}
                            <Mobile.ProfileName>{(username.length.toString() === "25") ? (<>Unnamed</>) : (<>{username}</>)}</Mobile.ProfileName>
                            <Mobile.ArtistDescription>
                                {description}
                            </Mobile.ArtistDescription>
                </Mobile.ProfileTopSection>
                <Mobile.ProfileNav>

                            <Nav className="nav-tabs nav-fill nav-justified" variant="pills" 
                                onSelect={(k) => setKey(k)} style={{borderColor: "rgba(0, 0, 0, 0.3)", position: "absolute",
                                    width: "100%"}}
                                defaultActiveKey="items">
                                    <Mobile.HoverItem>
                                        <Nav.Link className="profile" as={Link} 
                                        data-bs-toggle="tab" eventKey="items" style={{color: "rgba(0, 0, 0, 0.3)",
                                        fontSize: "16px", textTransform: "uppercase"}} to="items">Items</Nav.Link>
                                    </Mobile.HoverItem> 
                                    
                            </Nav>
                    <Mobile.NFTSection >
                        <Mobile.NFTSubSection>
                            <Outlet />
                        </Mobile.NFTSubSection>
                    </Mobile.NFTSection>
                </Mobile.ProfileNav>
            </Mobile.ProfileSection>
            </>
        )
        }
        </React.Fragment>
    )
}

export default ArtistProfile

