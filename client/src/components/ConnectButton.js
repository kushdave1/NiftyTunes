import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import {useEthers, useEtherBalance} from '@usedapp/core'
import {formatEther} from '@ethersproject/units'

import { useMoralis } from 'react-moralis'

import Badge from 'react-bootstrap/Badge'

import Spinner from 'react-bootstrap/Spinner'
import {useNavigate} from 'react-router'

function ConnectButton() {

    const {authenticate, isAuthenticated, isAuthenticating, hasAuthError, authError, user, logout} = useMoralis();

    let navigate = useNavigate();
    

    async function handleConnect(){
        await authenticate({
            onSuccess: () => navigate('/createnft'),
            onError: () => console.log(authError)
        })

    }

    async function handleDisconnect(){
        await logout({
            onSuccess: () => navigate('/')
        })
    }

    if(isAuthenticating){
        return <Button variant="primary" disabled>
                <Spinner animation="grow" size="sm"/>
                    Connecting
                </Button>
    }


    return isAuthenticated?(
                <Button variant ="outline-success" onClick={handleDisconnect}>
                    Authenticated
                </Button>
    ) : (
        <Button variant="primary" onClick={handleConnect}>Authenticate via MetaMask</Button>
    )
}

export default ConnectButton
