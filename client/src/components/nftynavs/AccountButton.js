import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

function AccountButton() {

    const {isAuthenticated, user, logout, account} = useMoralis();
    const [address, setAddress] = useState('');

    let navigate = useNavigate();
    

    useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'));
    }, [user]);

    async function handleDisconnect(){
        await logout({
            onSuccess: () => navigate('/')
        })
    }



    return isAuthenticated?(
            <DropdownButton
                id="user-profile-button"
                variant="secondary"
                menuVariant="dark"
                title= {address.slice(0,5) + '...' + address.slice(35,41)}
                className="mt-2"
            >
                <Dropdown.Item href="#/action-2"><i class="bi bi-eye-fill"></i> View NFTs</Dropdown.Item>
                <Dropdown.Item href="#/action-3"><i class="bi bi-gear-fill"></i> Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDisconnect}><i class="bi bi-box-arrow-left"></i> Logout</Dropdown.Item>
            </DropdownButton>
                
    ) : (
        <></>
    )
}

export default AccountButton
