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
import Banner from '../../assets/images/banner.jpg';
import { changeBackgroundWhite, changeBackgroundBlack } from "../nftyFunctions/hover"

//moralis
import { useMoralis } from 'react-moralis'
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

function MyProfile() {
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
    const [fileTarget, setFileTarget] = useState("");
    const { saveFile } = useMoralisFile();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'));
        setUsername(user.get('username'));
        setDescription(user.get('description'))
        setArtistType(user.get('artistType'));
        setProfilePhoto(user.get('profilePhotoURL'))
        setEtherscan(`https://etherscan.io/address/${address}`)
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
        console.log(fileTarget)
        await saveFile("photo.jpg", fileTarget, {
            type: "image",
            onSuccess: (result) => {user.set('profilePhoto', result); user.set('profilePhotoURL', result.url());console.log(result)},
            onError: (error) => console.log(error),
        });
        await user.save();

        setUsername(user.get('username'));
        setDescription(user.get('description'));
        setArtistType(user.get('artistType'));
        setProfilePhoto(user.get('profilePhotoURL'));
        console.log(profilePhoto)
    }

    const sendToEtherscan = async() => {
        window.location.href = "http://www.etherscan.io/address/"+address;
    }

    return (
        <React.Fragment>
            <img crossOrigin='true' crossoriginresourcepolicy='false' src={DefaultProfilePicture} height="300px" width="100%" style={{backgroundSize: "100%"}}></img>
                        <ProfileNavSection>
                            
                            <Container style={{paddingTop: "50px"}}>

                                {(profilePhoto) ? 
                                (<img crossOrigin='true' crossoriginresourcepolicy='false' src={profilePhoto} height="150px" width="150px" 
                                style={{boxShadow: "1px 1px 1px 1px #888888", marginTop: "-110px", borderRadius: "5.00rem"}}></img>) 
                                : (<img src={DefaultProfilePicture} height="150px" width="150px" 
                                style={{padding: "10px",border: "2px solid black", marginTop: "-110px",borderRadius: "5.00rem"}}></img>)}

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
                                <Form style={{padding: "50px"}}>
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
                                                         placeholder="Upload File" 
                                                         onInput={e => {setFileTarget(e.target.files[0]); console.log(e.target.files[0]);}}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Button variant="primary" onClick={()=>{saveUserInfo();handleClose();}}>
                                        Submit
                                    </Button>
                                </Form>       
                            </Modal>
                            <NFTSection className="d-flex justify-content-center">
                                <Outlet />
                            </NFTSection>  
        </React.Fragment>
    )
}

export default MyProfile