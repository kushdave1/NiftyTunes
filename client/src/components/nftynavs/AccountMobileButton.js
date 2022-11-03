import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'
import styled from 'styled-components'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { MdAccountCircle } from "react-icons/md";
import img from '../../assets/images/gorilla.png';
import hamburger from '../../assets/images/hamburger.png'
import ConnectButton from './ConnectButtonMobile'



function AccountMobileButton(props) {

    const {isAuthenticated, user, logout, account} = useMoralis();
    const [address, setAddress] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    

    let navigate = useNavigate();
    

    useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'));
        setProfilePhoto(user.get('profilePhotoURL'))

        console.log(props.showDropdown, "GAN")
        
    }, [user, props]);

    async function handleDisconnect(){
        props.handleClose()
        await logout({
            onSuccess: () => navigate('/')
        })
    }



    return isAuthenticated?(
                <AccountModal>
                    <AccountSection>
                            <ExploreText>Explore</ExploreText>
                            <ExploreSegment/>
                            <NavigateBox>
                                <MarketplaceButton onClick={()=>{props.handleClose();navigate("/gallery")}}>
                                    <MarketplaceText>Gallery</MarketplaceText>
                                </MarketplaceButton>
                                <LiveButton onClick={(e)=>{props.handleClose();e.preventDefault();navigate("/live");}}>
                                    <LiveText>NftyTunes Live</LiveText>
                                </LiveButton>
                                
                            </NavigateBox>
                            <ExploreSegmentTwo/>
                            <ProfileModule>
                                <ProfilePicName onClick={()=>{props.handleClose();navigate("/profile")}}>
                                    <ProfilePic src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>
                                    <ProfileLabel>My Profile</ProfileLabel>
                                </ProfilePicName>
                                <LogoutButton onClick={()=>{props.handleClose();handleDisconnect()}}>Logout</LogoutButton>
                            </ProfileModule>

                        {/* <Dropdown.Item href="/profile"><i class="bi bi-eye-fill"></i> My Profile</Dropdown.Item>
                        <Dropdown.Item href="/live">🤳🏻 Live Mints</Dropdown.Item>
                        {/* <Dropdown.Item href="/wethbalance"><i class="bi bi-gear-fill"></i> WETH Balance</Dropdown.Item>
                        <Dropdown.Item href="/collections">🐇 Mint a Bunny</Dropdown.Item>
                        <Dropdown.Item href="/staking">🥩 Stake a Bunny</Dropdown.Item>
                        
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleDisconnect}><i class="bi bi-box-arrow-left"></i> Logout</Dropdown.Item> */}
                    </AccountSection>
                </AccountModal>
    ) : (
        <AccountModal>
            <AccountSection>
                    <ExploreText>Explore</ExploreText>
                    <ExploreSegment/>
                    <NavigateBox>
                        <MarketplaceButton onClick={()=>{props.handleClose();navigate("/gallery")}}>
                            <MarketplaceText>Gallery</MarketplaceText>
                        </MarketplaceButton>
                        <LiveButton onClick={()=>{props.handleClose();navigate("/live")}}>
                            <LiveText>NftyTunes Live</LiveText>
                        </LiveButton>
                        
                    </NavigateBox>
                    <ExploreSegmentTwo/>
                    <ProfileModule>
                        <ConnectButton handleClose={props.handleClose}/>
                    </ProfileModule>

                {/* <Dropdown.Item href="/profile"><i class="bi bi-eye-fill"></i> My Profile</Dropdown.Item>
                <Dropdown.Item href="/live">🤳🏻 Live Mints</Dropdown.Item>
                {/* <Dropdown.Item href="/wethbalance"><i class="bi bi-gear-fill"></i> WETH Balance</Dropdown.Item>
                <Dropdown.Item href="/collections">🐇 Mint a Bunny</Dropdown.Item>
                <Dropdown.Item href="/staking">🥩 Stake a Bunny</Dropdown.Item>
                
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDisconnect}><i class="bi bi-box-arrow-left"></i> Logout</Dropdown.Item> */}
            </AccountSection>
        </AccountModal>
    )
}

export default AccountMobileButton


const AccountModal = styled.div`

position: absolute;
width: 100vw;
height: 303px;
top: 70px;

/* white */

z-index: 5;

background: #FFFFFF;
border-radius: 0px 0px 10px 10px;
`

const AccountSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 50px;

width: 335px;
height: 203px;
`

const ExploreSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 24px;
top: 40px;
left: 20px;
right: 20px;
bottom: 30px;

width: 330px;
height: 109px;

`

const ExploreText = styled.div`
width: 90px;
height: 15px;
top: 40px;
left: 20px;
position: absolute;
/* Caption */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 15px;
/* identical to box height, or 73% */

text-transform: uppercase;

/* black */

color: #000000;
`

const ExploreSegment = styled.div`
width: 330px;
height: 0px;

/* gray */

border: 1px solid #D2D2D2;
position: absolute;
top: 77px;
left: 20px;
`

const ExploreSegmentTwo = styled.div`
width: 330px;
height: 0px;

/* gray */

border: 1px solid #D2D2D2;
position: absolute;
top: 173px;
left: 20px;
`


const NavigateBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
position: absolute;
padding: 0px;
gap: 14px;

width: 132px;
height: 46px;
top: 101px;
left: 20px;

`

const MarketplaceButton = styled.button`
border: none;
background: transparent;
`

const MarketplaceText = styled.div`
width: 96px;
height: 16px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */


/* black */

color: #000000;
`

const LiveButton = styled.button`
border: none;
background: transparent;
white-space: nowrap;
`

const LiveText = styled.div`
width: 106px;
height: 16px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */
white-space: nowrap;

/* black */

color: #000000;
`


const LiveEllipse = styled.div`
width: 8px;
height: 8px;

/* fuchsia */

background: #FF007A;
border-radius: 10px;
`

const ProfileModule = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 0px;
gap: 24px;
position: absolute;


width: 335px;
height: 34px;
top: 197px;
left: 20px;


`

const ProfilePicName = styled.button`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 14px;

border: none;
background: transparent;

width: 126px;
height: 34px;
`

const ProfilePic = styled.img`
height: 34px;
width: 34px;


border-radius: 80px;
`

const ProfileLabel = styled.div`
width: 78px;
height: 16px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */


/* black */

color: #000000;
`

const LogoutButton = styled.button`
width: 75px;
height: 16px;

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 16px;
/* identical to box height */
margin-top: -7px;
margin-right: 5px;

border: none;
background: transparent;


/* black */

color: #000000;
`

// const ConnectButton = styled.button`
// display: flex;
// flex-direction: row;
// justify-content: center;
// align-items: center;
// padding: 14px 26px;
// gap: 10px;

// width: 335px;
// height: 44px;

// /* black */

// background: #000000;
// border-radius: 30px;
// `

const ConnectText = styled.div`
width: 116px;
height: 16px;

/* button_text */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* identical to box height */
white-space: nowrap;

/* white */

color: #FFFFFF;
`