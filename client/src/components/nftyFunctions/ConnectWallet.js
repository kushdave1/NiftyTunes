import { useMoralis } from 'react-moralis'
import Moralis from 'moralis'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

export const ConnectWallet = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = signer.getAddress()

    return signer

}