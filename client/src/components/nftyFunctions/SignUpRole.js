import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import { useMoralis } from 'react-moralis'
import Moralis from 'moralis'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import { useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";


export const CheckUserRole = async(nftyLazyFactoryAddress, nftyLazyContractABIJson) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = signer.getAddress()
    const nftyLazyContract = new ethers.Contract(nftyLazyFactoryAddress, nftyLazyContractABIJson, signer)


    const signerRole = utils.keccak256(utils.toUtf8Bytes("SIGNER_ROLE"))

    let isRole = await nftyLazyContract.hasRole(signerRole, signerAddress)

    return isRole;
}

export const SignUpUser = async(marketAddress, marketContractABIJson, nftyLazyFactoryAddress) => {

    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = signer.getAddress()
    const marketContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)


    const signerRole = utils.keccak256(utils.toUtf8Bytes("SIGNER_ROLE"))


    let transaction = await marketContract.setSignerRole(nftyLazyFactoryAddress)
    transaction.wait()
    console.log('success for sure')

        
    }