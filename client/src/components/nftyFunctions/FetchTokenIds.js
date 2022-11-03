import Moralis from 'moralis'
import { fetchArtistPhoto, fetchArtistName } from '../nftyFunctions/fetchCloudData'
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import { fixURL, fixImageURL } from './fixURL'
import { useIPFS } from "hooks/useIPFS";
import { APP_ID, SERVER_URL } from "../../index"
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { checkFileType } from "../nftyFunctions/checkFileType"
 

export const fetchTokenIds = async(marketAddress, marketContractABI, storageAddress, storageContractABI) => {
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    const contractABIJson = JSON.parse(marketContractABI);
    const storageContractABIJson = JSON.parse(storageContractABI);

    Moralis.start({ serverUrl, appId});

    const signer = await ConnectWallet()

    const signerAddress = await signer.getAddress();

    const ListedNFTs = await Moralis.Object.extend("ListedNFTs");

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)
    

    const query = new Moralis.Query(ListedNFTs);

    const data = await query.find();

    const items = []

    let image = ''
    let imageLink = ''

    

    for (const i in data) {
      const object = data[i];
      const meta = await axios.get(fixURL(object.get("tokenURI")))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }
      const fileType = await checkFileType(imageLink)
      let item = {
        price: object.get("price"), 
        fileType: fileType,
        tokenId: object.get("tokenId"),
        artist: object.get("signerAddress"),
        owner: object.get("signerAddress"),
        artistPhoto: await fetchArtistPhoto(object.get("signerAddress")),
        artistName: await fetchArtistName(object.get("signerAddress")),
        ownerPhoto: await fetchArtistPhoto(object.get("signerAddress")),
        ownerName: await fetchArtistName(object.get("signerAddress")),
        coverPhotoURL: object.get("coverPhotoURL"),
        gallery: object.get("galleryAddress"),
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tier: meta.data.tier,
        tokenURI: object.get("tokenURI"),
        voucher: object.get("voucher"),
        lazy: true,
        isSold: object.get("isSold"),
        tokenAddress: false
      }
      if (item.isSold === false) {
        items.push(item);
      }
    }

    const dataStorage = await storageContract.fetchMarketItems()

    await Promise.all(dataStorage.map(async i => {
      if (i.tokenId.toString() === '0') {
        return;
      }
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }

      const fileType = await checkFileType(imageLink)


      let artistPhoto = await fetchArtistPhoto(i.publisher)
      let artistName = await fetchArtistName(i.publisher)
      let ownerPhoto = await fetchArtistPhoto(i.owner)
      let ownerName = await fetchArtistName(i.owner)

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        fileType: fileType,
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        seller: i.seller,
        artist: i.publisher,
        artistPhoto: artistPhoto,
        artistName: artistName,
        ownerPhoto: ownerPhoto,
        ownerName: ownerName,
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tier: meta.data.tier,
        tokenURI,
        lazy: false,
        isSold: true,
        tokenAddress: i.tokenAddress,

      }

      items.push(item)
    }))


    return items;
  }

export const fetchListedIds = async(marketAddress, marketContractABI, storageAddress, storageContractABI) => {
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    const contractABIJson = JSON.parse(marketContractABI);
    const storageContractABIJson = JSON.parse(storageContractABI);

    Moralis.start({ serverUrl, appId});

  
    const signer = await ConnectWallet()

    const signerAddress = await signer.getAddress();
    const ListedNFTs = await Moralis.Object.extend("ListedNFTs");

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)
    const dataStorage = await storageContract.fetchItemsListed(signerAddress)

    const query = new Moralis.Query(ListedNFTs);
    query.equalTo("signerAddress", signerAddress);
    const data = await query.find();
    
    const items = []

    let image = ''
    let imageLink = ''

    for (const i in data) {
      const object = data[i];
      const meta = await axios.get(fixURL(object.get("tokenURI")))
      console.log(meta, "IPFS")
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }
      const fileType = await checkFileType(imageLink)
      let item = {
        price: object.get("price"), 
        fileType: fileType,
        tokenId: object.get("tokenId"),
        artist: object.get("signerAddress"),
        artistPhoto: await fetchArtistPhoto(object.get("signerAddress")),
        artistName: await fetchArtistName(object.get("signerAddress")),
        owner: object.get("signerAddress"),
        ownerPhoto: await fetchArtistPhoto(object.get("signerAddress")),
        ownerName: await fetchArtistName(object.get("signerAddress")),
        coverPhotoURL: object.get("coverPhotoURL"),
        gallery: object.get("galleryAddress"),
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tier: meta.data.tier,
        tokenURI: object.get("tokenURI"),
        voucher: object.get("voucher"),
        lazy: true,
        isSold: object.get("isSold"),
        tokenAddress: false
      }
      console.log(item.isSold, "This item is stated as this")
      if (item.isSold === false) {
        items.push(item);
        console.log(item.image)
      }
    }

    

    await Promise.all(dataStorage.map(async i => {
      if (i.tokenId.toString() === '0') {
        return;
      }
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }
      const fileType = await checkFileType(imageLink)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        fileType: fileType,
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        seller: i.seller,
        artist: i.publisher,
        artistPhoto: await fetchArtistPhoto(i.publisher),
        artistName: await fetchArtistName(i.publisher),
        ownerPhoto: await fetchArtistPhoto(i.owner),
        ownerName: await fetchArtistName(i.owner),
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tier: meta.data.tier,
        tokenURI,
        lazy: false,
        isSold: true,
        tokenAddress: i.tokenAddress
      }
      items.push(item)

    }))

    console.log(items)
    
    return items;
  }

export const fetchOwnedIds = async(marketAddress, marketContractABI, storageAddress, storageContractABI) => {
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    const contractABIJson = JSON.parse(marketContractABI);
    const storageContractABIJson = JSON.parse(storageContractABI);

    Moralis.start({ serverUrl, appId});

    
    const signer = await ConnectWallet()

    const signerAddress = await signer.getAddress();

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)
    const dataStorage = await storageContract.fetchMyNFTs()

    let imageLink = ''
    const items=[]
    
    await Promise.all(dataStorage.map(async i => {
      if (i.tokenId.toString() === '0') {
        return;
      }
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }
      const fileType = await checkFileType(imageLink)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        fileType: fileType,
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        seller: i.seller,
        artist: i.publisher,
        artistPhoto: await fetchArtistPhoto(i.publisher),
        artistName: await fetchArtistName(i.publisher),
        ownerPhoto: await fetchArtistPhoto(i.owner),
        ownerName: await fetchArtistName(i.owner),
        tier: meta.data.tier,
        tokenAddress: i.tokenAddress,
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI,
        lazy: false,
        isSold: true,
        tokenAddress: i.tokenAddress
      }
      items.push(item)
    }))


    return items;
  }

