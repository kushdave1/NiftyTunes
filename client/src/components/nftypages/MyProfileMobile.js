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

const NFTSection = styled.div `
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;

function MyProfileMobile() {
    const {isAuthenticated, user} = useMoralis();

    const [address, setAddress] = useState('');
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

        if (artistType !== "Collector" && await CheckUserRole(nftyLazyFactoryAddress, nftyLazyContractABIJson) === false) {
            handleMinterShow()
        }

    }, [user]);
    
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
            {(bannerPhoto) ? (<img crossOrigin='true' crossoriginresourcepolicy='false' src={bannerPhoto} height="300px" width="100%" style={{backgroundSize: "100%"}}></img>) :
            (<img crossOrigin='true' crossoriginresourcepolicy='false' src={Banner} height="300px" width="100%" style={{backgroundSize: "100%"}}></img>)}
                        <ProfileNavSection>
                            
                            <Container style={{paddingTop: "50px"}}>
                                <Row style={{display: "flex"}}>
                                    <Col sm={10}>
                                    {(profilePhoto) ? 
                                    (<img crossOrigin='true' crossoriginresourcepolicy='false' src={profilePhoto} height="150px" width="150px" 
                                    style={{boxShadow: "1px 1px 1px 1px #888888", marginTop: "-110px", borderRadius: "5.00rem"}}></img>) 
                                    : (<img src={DefaultProfilePicture} height="150px" width="150px" 
                                    style={{padding: "10px",border: "2px solid black", marginTop: "-110px",borderRadius: "5.00rem"}}></img>)}
                                    </Col>
                                    <Col sm={2} style={{marginTop: "-25px"}}>
                                    {twitter && 
                                        <a className="socials" href={twitter} style={{padding:"10px"}}>
                                            <i class="bi bi-twitter" style={{fontSize: "1.75rem", color: "cornflowerblue"}}></i>
                                        </a>
                                    }
                                    {discord &&
                                        <a className="socials" href={discord} style={{padding:"10px"}}>
                                            <i class="bi bi-discord" style={{fontSize: "1.75rem", color: "#7289DA"}}></i>
                                        </a>
                                    }
                                    {tiktok && 
                                        <a className="socials" href={tiktok} style={{padding:"10px"}}>
                                            <i class="bi bi-tiktok" style={{fontSize: "1.75rem", color: "#FF5700"}}></i>
                                        </a>
                                    }
                                    {instagram && 
                                        <a className="socials" href={instagram} style={{padding:"10px"}}>
                                            <i class="bi bi-instagram" style={{fontSize: "1.75rem", color: "#8a3ab9"}}></i>
                                        </a>
                                    }
                                    </Col>
                                </Row>

                                

                                <div style={{paddingTop: "20px", paddingBottom: "20px"}}> 
                                    <div style={{paddingBottom: "5px", fontSize: 30}}>{username}   <Button onClick={()=>sendToEtherscan()} style={{ color: "grey", background: "white", borderRadius: "4rem", borderColor: "white", boxShadow: "2px 2px 2px 2px #888888"}}>{address.slice(0,5)}...{address.slice(38,43)}</Button></div>
                                    
                                    
                                    
                                    <div style={{paddingTop: "10px", paddingBottom: "10px"}}>{artistType}</div>
                                    <Button className="button-hover" variant="secondary" style={{ color: "black", background: "white", borderRadius: "2rem" }} onMouseEnter={changeBackgroundWhite} onMouseOut={changeBackgroundBlack} onClick={() => handleShow()} >Edit User Profile</Button>
                                </div>
                                <Nav className="justify-content-left nav-tabs">
                                    <Nav.Item>
                                        <Nav.Link as={Link} className = "text-dark-3" to="onsale">On Sale</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} className = "text-dark-3" to="sold">Sold</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} className = "text-dark-3" to="owned">Owned</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} className = "text-dark-3" to="created">Created</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} className = "text-dark-3" to="activity">Activity</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Container>
                        </ProfileNavSection>
                             <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
                                <Modal.Header style={{backgroundColor: "black"}} >
                                    <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
                                </Modal.Header>
                                <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                                    Enter Your Details! (Feel free to leave anything blank)
                                </Modal.Title>
                                <Form style={{padding: "30px"}}>
                                    <Form.Group className="mb-3" controlId="formArtistName">
                                        <Form.Label>Artist Name</Form.Label>
                                        <Form.Control 
                                        type="username" 
                                        placeholder="Enter username" 
                                        onInput={e => setUsernameEntered(e.target.value)}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formArtistName">
                                        <Form.Label>Artist Description</Form.Label>
                                        <Form.Control 
                                        rows={5}
                                        type="description" 
                                        placeholder="Artist Description" 
                                        onInput={e => setDescriptionEntered(e.target.value)}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formArtistType">
                                        <Form.Label>Type of Artist</Form.Label>
                                        <Form.Select aria-label="Default select example" onInput={e => setArtistTypeEntered(e.target.value)}>
                                            <option>Open this select menu</option>
                                            <option value="Visual Animator">Visual Animator</option>
                                            <option value="Musician">Musician</option>
                                            <option value="Collector">Collector</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formProfilePic">
                                        <Form.Label>Upload a Profile Picture!</Form.Label>
                                        <Form.Control 
                                                         type="file" 
                                                         placeholder="Upload ProPic" 
                                                         onInput={e => {setFileTarget(e.target.files[0]); console.log(e.target.files[0]);}}>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formProfilePic">
                                        <Form.Label>Upload a Banner!</Form.Label>
                                        <Form.Control 
                                                         type="file" 
                                                         placeholder="Upload Banner" 
                                                         onInput={e => {setBannerFileTarget(e.target.files[0]); console.log(e.target.files[0]);}}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{handleClose();handleSocialsShow();}}>
                                        Next
                                    </Button>
                                </Form>       
                            </Modal>
                            <Modal show={socialsShow} onHide={handleSocialsClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
                                <Modal.Header style={{backgroundColor: "black"}} >
                                    <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
                                </Modal.Header>
                                <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                                    Help fans find you on Social Media! (Links Only)
                                </Modal.Title>
                                <Form style={{padding: "30px"}}>
                                    <Form.Group className="mb-3" controlId="formTwitter">
                                        <Form.Label>Twitter</Form.Label>
                                        <Form.Control 
                                        type="twitter" 
                                        placeholder="Twitter Link" 
                                        onInput={e => setTwitterEntered(e.target.value)}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formInstagram">
                                        <Form.Label>Instagram</Form.Label>
                                        <Form.Control 
          
                                        type="instagram" 
                                        placeholder="Instagram Link" 
                                        onInput={e => setInstagramEntered(e.target.value)}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formDiscord">
                                        <Form.Label>Discord</Form.Label>
                                        <Form.Control 
                                        type="discord" 
                                        placeholder="Instagram Link" 
                                        onInput={e => setDiscordEntered(e.target.value)}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formTiktok">
                                        <Form.Label>Tiktok</Form.Label>
                                        <Form.Control 
                                        type="tiktok" 
                                        placeholder="Tiktok Link" 
                                        onInput={e => setTiktokEntered(e.target.value)}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                    <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{saveUserInfo();handleSocialsClose();}}>
                                        Submit
                                    </Button>
                                </Form>       
                            </Modal>

                            <Modal show={minterShow} onHide={handleMinterClose} contentClassName = 'modal-rounded-6' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
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
                                

                            </Modal>

                            <NFTSection className="d-flex justify-content-center">
                                <Outlet />
                            </NFTSection>  
        </React.Fragment>
    )
}

export default MyProfileMobile