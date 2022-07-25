import Moralis from 'moralis'
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { fixURL, fixImageURL } from './fixURL'
import { useIPFS } from "hooks/useIPFS";
import { APP_ID, SERVER_URL } from "../../index"

import LiveMintFactory from '../../contracts/LiveMint.sol/LiveMintFactory.json';
 
export const FetchLiveTokenURI = async(liveMintAddress, mintNumber, tokenId, coverArt) => {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const { chainId } = await provider.getNetwork();
    const signer = provider.getSigner()

    const liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
    console.log(liveMintAddress)
    const liveMintFactoryContract = liveMintFactory.attach(liveMintAddress);
    let tokenURI = ""
    try {
        tokenURI = await liveMintFactoryContract.tokenURI(tokenId)
    } catch {
        tokenURI = ""
    }
    console.log(tokenURI, "HIASDKNASDIN")
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