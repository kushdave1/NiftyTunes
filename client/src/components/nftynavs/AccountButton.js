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
import styled from 'styled-components'



function AccountButton() {

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
            <NavButton
                id="user-profile-button"
                variant='dark'
                title= {(profilePhoto) ?  (<img src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false' width="37.5" height="37.5" style={{borderRadius: "2rem"}}></img>) : (<img src={img} width="40" height="35"></img>)}
            >
                <Dropdown.Item href="/profile/onsale"><i class="bi bi-eye-fill"></i> My Profile</Dropdown.Item>
                {/* <Dropdown.Item href="/wethbalance"><i class="bi bi-gear-fill"></i> WETH Balance</Dropdown.Item>
                <Dropdown.Item href="/collections">🐇 Mint a Bunny</Dropdown.Item>
                <Dropdown.Item href="/staking">🥩 Stake a Bunny</Dropdown.Item>
                 */}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDisconnect}><i class="bi bi-box-arrow-left"></i> Logout</Dropdown.Item>
            </NavButton>
                
    ) : (
        <></>
    )
}


export default AccountButton


const NavButton = styled(DropdownButton)`
    /* button */


    /* Auto layout */

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 14px 26px;
    gap: 10px;

    position: absolute;
    width: 168px;
    right: 41px;
    top: 17.14%;
    bottom: 20%;
    font-size: 14px;
    background-color: #000000;

    border-radius: 30px;
`