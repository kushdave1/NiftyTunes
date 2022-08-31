import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { MdAccountCircle } from "react-icons/md";
import img from '../../assets/images/gorilla.png';
import hamburger from '../../assets/images/hamburger.png'



function AccountMobileButton() {

    const {isAuthenticated, user, logout, account} = useMoralis();
    const [address, setAddress] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    let navigate = useNavigate();
    

    useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'));
        setProfilePhoto(user.get('profilePhotoURL'))
    }, [user]);

    async function handleDisconnect(){
        await logout({
            onSuccess: () => navigate('/')
        })
    }



    return isAuthenticated?(
            <DropdownButton
                align="end"
                id="user-profile-button"
                variant="light"
                title= {(profilePhoto) ?  (<img src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false' width="37.5" height="37.5" style={{borderRadius: "2rem"}}></img>) : (<img src={hamburger} width="40" height="40"></img>)}
            >
                <Dropdown.Item href="/profile"><i class="bi bi-eye-fill"></i> My Profile</Dropdown.Item>
                <Dropdown.Item href="/live">🤳🏻 Live Mints</Dropdown.Item>
                {/* <Dropdown.Item href="/wethbalance"><i class="bi bi-gear-fill"></i> WETH Balance</Dropdown.Item>
                <Dropdown.Item href="/collections">🐇 Mint a Bunny</Dropdown.Item>
                <Dropdown.Item href="/staking">🥩 Stake a Bunny</Dropdown.Item> */} 
                
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDisconnect}><i class="bi bi-box-arrow-left"></i> Logout</Dropdown.Item>
            </DropdownButton>
                
    ) : (
        <></>
    )
}

export default AccountMobileButton
