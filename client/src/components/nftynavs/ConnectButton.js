import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Nav from 'react-bootstrap/Nav'


function ConnectButton() {

    const {authenticate, isAuthenticated, isAuthenticating, hasAuthError, authError, user, logout, account} = useMoralis();
    const [address, setAddress] = useState('');

    let navigate = useNavigate();
    

    useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'));
    }, [user]);

    async function handleConnect(){
        await authenticate({
            onSuccess: () => navigate('/profile'),
            onError: () => console.log(authError)
        })

    }

    if(isAuthenticating){
        return <Spinner variant="light" animation="grow" size="sm" />
                
    }


    return isAuthenticated?(
            <></>
                
    ) : (
        <Nav.Link className="text-primary" style={{fontWeight:"500"}} onClick={handleConnect}>Sign Up</Nav.Link>    )
}

export default ConnectButton
