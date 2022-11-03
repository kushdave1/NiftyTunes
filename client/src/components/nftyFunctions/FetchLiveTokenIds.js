import Moralis from 'moralis'
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { GetProvider } from '../nftyFunctions/GetProvider'

import { fixURL, fixImageURL } from './fixURL'
import { useIPFS } from "hooks/useIPFS";
import { APP_ID, SERVER_URL } from "../../index"

import LiveMintFactory from '../../contracts/LiveMint.sol/LiveMintFactory.json';

import LiveAuctionFactory from '../../contracts/LiveMint.sol/LiveMintAuction.json';
 
export const FetchLiveTokenURI = async(liveMintAddress, mintNumber, tokenId, coverArt, isAuthenticated) => {

    
    console.log("FREE")

    let signer
    let liveMintFactory
    let liveMintFactoryContract

    if (isAuthenticated) {
        signer = await ConnectWallet()
        liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
        liveMintFactoryContract = liveMintFactory.attach(liveMintAddress);
    } else {
        signer = GetProvider()
        liveMintFactoryContract = new ethers.Contract(liveMintAddress, LiveMintFactory.abi, signer)
    }

    let tokenURI = ""
    try {
        tokenURI = await liveMintFactoryContract.tokenURI(tokenId)
    } catch {
        tokenURI = ""
    }

    return tokenURI
        

    // const meta = await axios.get(fixURL(tokenURI))

    // console.log(tokenURI)
    //     for (const j in meta.data) {
    //         if ((meta.data[j]).toString().includes('ipfs')) {
    //             imageLink = meta.data[j]
    //         }
    //     }
        
    //     let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    //     let item = {
    //         price,
    //         tokenId: i.tokenId.toNumber(),
    //         owner: i.owner,
    //         seller: i.seller,
    //         artist: i.publisher,
    //         artistPhoto: await fetchArtistPhoto(i.publisher),
    //         artistName: await fetchArtistName(i.publisher),
    //         ownerPhoto: await fetchArtistPhoto(i.owner),
    //         ownerName: await fetchArtistName(i.owner),
    //         image: imageLink,
    //         name: meta.data.name,
    //         description: meta.data.description,
    //         tokenURI,
    //         lazy: false
    //     }
    // }

    // const fetchLiveIds = liveMintFactoryContract.



}

export const FetchLiveOwner = async(liveMintAddress, tokenId) => {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const { chainId } = await provider.getNetwork();
    const signer = provider.getSigner()

    const liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
    console.log(liveMintAddress)
    const liveMintFactoryContract = liveMintFactory.attach(liveMintAddress);
    console.log(liveMintFactoryContract, "FACTORY OWNER")
    let owner = ""

    try {

        owner = await liveMintFactoryContract.ownerOf(tokenId)
    } catch {
        owner = ""
    }

    return owner

}

export const FetchAuctionId = async(liveAuctionAddress) => {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const { chainId } = await provider.getNetwork();
    const signer = provider.getSigner()

    const liveAuctionFactory = new ethers.ContractFactory(LiveAuctionFactory.abi, LiveAuctionFactory.bytecode, signer)

    const liveMintFactoryContract = liveAuctionFactory.attach(liveAuctionAddress);
    let auctionId = ""
    try {
        auctionId = await liveMintFactoryContract.getCurrentAuction()
    } catch {
        auctionId = ""
    }

    return auctionId

}