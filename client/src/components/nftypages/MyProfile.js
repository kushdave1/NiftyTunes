//react
import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Routes, 
    Route, 
    Link,
    Outlet
} from "react-router-dom"
import {useNavigate} from 'react-router'
import { useMoralisFile } from "react-moralis";
import ProfileInfo from '../nftyModals/ProfileModals/ProfileInfo'
import ProfileSocials from '../nftyModals/ProfileModals/ProfileSocials'
import profilebanner from '../../assets/images/profilebanner.png'
import * as Desktop from '../nftyCSS/MyProfileDesktop'

import * as Mobile from '../nftyCSS/MyProfileMobile'


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
import { useMoralis } from 'react-moralis'
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import MyListedNFTs from 'components/nftyprofiles/MyListedNFTs'



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



function MyProfile() {
    const {isAuthenticated, user} = useMoralis();
    const [key, setKey] = useState("onsale")

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
    

    useEffect(async() => {
        console.log(key, "SK")
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        if(!user) return null;
        setAddress(user.get('ethAddress'));
        setUsername(user.get('username'));
        setDescription(user.get('description'))
        setArtistType(user.get('artistType'));
        setProfilePhoto(user.get('profilePhotoURL'))
        setBannerPhoto(user.get('bannerPhotoURL'))

        setTwitter(user.get('twitter'));
        setInstagram(user.get('instagram'));
        setDiscord(user.get('discord'))
        setTiktok(user.get('tiktok'));

        setEtherscan(`https://etherscan.io/address/${address}`)

        // if (artistType !== "Collector" && await CheckUserRole(nftyLazyFactoryAddress, nftyLazyContractABIJson) === false) {
        //     handleMinterShow()
        // }
        return () => window.removeEventListener("resize",updateDimensions);
    }, [user, key]);

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }
    
    let navigate = useNavigate();

    const saveUserInfo = async() => {
        if (usernameEntered !== "") {
            user.set('username', usernameEntered)
        }

        if (descriptionEntered !== "") {
            user.set('description', descriptionEntered)
        }

        if (artistTypeEntered !== "") {
            user.set('artistType', artistTypeEntered)
        }

        if (twitterEntered !== "") {
            user.set('twitter', twitterEntered)
        }

        if (instagramEntered !== "") {
            user.set('instagram', instagramEntered)
        }

        if (discordEntered !== "") {
            user.set('discord', discordEntered)
        }

        if (tiktokEntered !== "") {
            user.set('tiktok', tiktokEntered)
        }
    

        await saveFile("photo.jpg", fileTarget, {
            type: "image",
            onSuccess: (result) => {user.set('profilePhoto', result); user.set('profilePhotoURL', result.url());console.log(result)},
            onError: (error) => console.log(error),
        });

        await saveFile("photo.jpg", bannerFileTarget, {
            type: "image",
            onSuccess: (result) => {user.set('bannerPhoto', result); user.set('bannerPhotoURL', result.url());console.log(result)},
            onError: (error) => console.log(error),
        });
        
        
        await user.save();

        setUsername(user.get('username'));
        setDescription(user.get('description'));
        setArtistType(user.get('artistType'));
        setProfilePhoto(user.get('profilePhotoURL'));

        setTwitter(user.get('twitter'));
        setInstagram(user.get('instagram'));
        setDiscord(user.get('discord'));
        setTiktok(user.get('tiktok'));


    }

    const sendToEtherscan = async() => {
        window.location.href = "http://www.etherscan.io/address/"+address;
    }

    return (
        <React.Fragment>
        
        {(responsive.showTopNavMenu) ? (
            <Desktop.ProfileSection>
                <Desktop.ProfileBanner src={profilebanner}/>
                <Desktop.ProfileSubSection>
                    <Desktop.ProfileTopSection>
                        <Desktop.ProfilePhotoName>
                        {(profilePhoto) ? (<Desktop.ProfilePhoto src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<Desktop.ProfilePhoto src={DefaultProfilePicture}/>)}
                        <Desktop.ProfileNameEtherscan>
                            <Desktop.ProfileName>{(username.length.toString() === "25") ? (<>Unnamed</>) : (<>{username}</>)}</Desktop.ProfileName>
                            <Desktop.Etherscan onClick={()=>sendToEtherscan()}>
                                <Desktop.EtherscanText>{address.slice(0,5)}...{address.slice(38,43)}</Desktop.EtherscanText>
                            </Desktop.Etherscan>
                        </Desktop.ProfileNameEtherscan>
                        </Desktop.ProfilePhotoName>
                        <Desktop.EditProfile onClick={()=>navigate('edit')}>
                            <Desktop.EditProfileText>
                                Edit profile
                            </Desktop.EditProfileText>
                        </Desktop.EditProfile>
                    </Desktop.ProfileTopSection>
                    <Desktop.ProfileNav>
                        <Desktop.NavSelect>
                            <Desktop.NavBarSelect>
                                <Nav className="justify-content-left nav-tabs" variant="pills" style={{width: "100%"}} onSelect={(k) => setKey(k)} 
                                style={{borderColor: "rgba(0, 0, 0, 0.3)"}} defaultActiveKey="onsale">
                                    <Desktop.HoverItem>
                                        <Nav.Link className="profile" as={Link} eventKey="owned" style={{color: "rgba(0, 0, 0, 0.3)"}} to="owned">
                                            Owned
                                        </Nav.Link>
                                    </Desktop.HoverItem>
                                    <Desktop.HoverItem>
                                        <Nav.Link className="profile" as={Link} eventKey="onsale" style={{color: "rgba(0, 0, 0, 0.3)"}} to="onsale">On Sale</Nav.Link>
                                    </Desktop.HoverItem>
                                    <Desktop.HoverItem>
                                        <Nav.Link className="profile" as={Link} eventKey="sold" style={{color: "rgba(0, 0, 0, 0.3)"}} to="sold">Sold</Nav.Link>
                                    </Desktop.HoverItem> 
                                    <Desktop.HoverItem>
                                        <Nav.Link className="profile" as={Link} eventKey="activity" style={{color: "rgba(0, 0, 0, 0.3)"}} to="activity">Activity</Nav.Link>
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
                <Mobile.ProfileBanner src={profilebanner}/>

                    <Mobile.ProfileTopSection>
                        <Mobile.ProfilePhotoName>
                        {(profilePhoto) ? (<Mobile.ProfilePhoto src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<Mobile.ProfilePhoto src={DefaultProfilePicture}/>)}
                        <Mobile.ProfileNameEtherscan>
                            <Mobile.ProfileName>{(username.length.toString() === "25") ? (<>Unnamed</>) : (<>{username}</>)}</Mobile.ProfileName>
                            <Mobile.Etherscan onClick={()=>sendToEtherscan()}>
                                <Mobile.EtherscanText>{address.slice(0,5)}...{address.slice(38,43)}</Mobile.EtherscanText>
                            </Mobile.Etherscan>
                        </Mobile.ProfileNameEtherscan>
                        </Mobile.ProfilePhotoName>
                        <Mobile.EditProfile onClick={()=>navigate('edit')}>
                            <Mobile.EditProfileText>
                                Edit profile
                            </Mobile.EditProfileText>
                        </Mobile.EditProfile>
                    </Mobile.ProfileTopSection>
                    <Mobile.ProfileNav>
              
               
                                <Nav className="nav-tabs nav-fill nav-justified" variant="pills" 
                                    onSelect={(k) => setKey(k)} style={{borderColor: "rgba(0, 0, 0, 0.3)", position: "absolute",
                                    marginTop: "415px", width: "100%"}}
                                    defaultActiveKey="onsale">
                                        <Mobile.HoverItem>
                                            <Nav.Link className="profile" as={Link} 
                                            data-bs-toggle="tab" eventKey="onsale" style={{color: "rgba(0, 0, 0, 0.3)",
                                            fontSize: "16px", textTransform: "uppercase"}} to="onsale">On Sale</Nav.Link>
                                        </Mobile.HoverItem> 
                                        <Mobile.HoverItem>
                                            <Nav.Link className="profile" as={Link} 
                                            data-bs-toggle="tab" eventKey="owned" style={{color: "rgba(0, 0, 0, 0.3)",
                                            fontSize: "16px", textTransform: "uppercase"}} to="owned">
                                                Owned
                                            </Nav.Link>
                                        </Mobile.HoverItem>
                                        <Mobile.HoverItem>
                                            <Nav.Link className="profile" as={Link} 
                                            data-bs-toggle="tab" eventKey="sold" style={{color: "rgba(0, 0, 0, 0.3)",
                                            fontSize: "16px", textTransform: "uppercase", whiteSpace: "nowrap"}} to="sold">
                                            Sold</Nav.Link>
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
                            {/* <ProfileInfo show={show} handleClose={handleClose} setUsernameEntered={setUsernameEntered} setDescriptionEntered={setDescriptionEntered}
                            setArtistTypeEntered={setArtistTypeEntered} setFileTarget={setFileTarget} setBannerFileTarget={setBannerFileTarget} handleClose={handleClose}
                            handleSocialsShow={handleSocialsShow} />

                            <ProfileSocials socialsShow={socialsShow} handleSocialsClose={handleSocialsClose} setTwitterEntered={setTwitterEntered} 
                            setInstagramEntered={setInstagramEntered} setDiscordEntered={setDiscordEntered} setTiktokEntered={setTiktokEntered} 
                            saveUserInfo={saveUserInfo} /> */}

                            
                            {/* <Modal show={minterShow} onHide={handleMinterClose} contentClassName = 'modal-rounded-6' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
                                <Modal.Header style={{backgroundColor: "black"}} >
                                    <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
                                </Modal.Header>
                                <Form style={{padding: "30px"}}>
                                     <Form.Group className="mb-3" controlId="formArtistName">
                                        <Form.Label style={{fontSize: 24, fontWeight: "bold"}}>Become an Official NftyTunes Minter!</Form.Label>
                                        <Form.Label>
                                        Pay a small one-time gas fee ($0.05) and mint on our site for free forever.
                                        </Form.Label>
                
                                    </Form.Group>
                                    
                                    <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>SignUpUser(marketAddress, marketContractABIJson, nftyLazyFactoryAddress)}>
                                        Sign up!
                                    </Button>
                                </Form>
                                

                            </Modal> */}

                            {/* <NFTSection className="d-flex justify-content-center">
                                <Outlet />
                            </NFTSection>   */}
        </React.Fragment>
    )
}

export default MyProfile

