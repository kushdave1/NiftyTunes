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
 

export const fetchTokenIds = async(marketAddress, marketContractABI, storageAddress, storageContractABI) => {
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    const contractABIJson = JSON.parse(marketContractABI);
    const storageContractABIJson = JSON.parse(storageContractABI);

    Moralis.start({ serverUrl, appId});

    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const signerAddress = await signer.getAddress();
    const ListedNFTs = await Moralis.Object.extend("ListedNFTs");

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)
    const dataStorage = await storageContract.fetchMarketItems()

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
      let item = {
        price: object.get("price"), 
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
        tokenURI: object.get("tokenURI"),
        voucher: object.get("voucher"),
        lazy: true,
        isSold: object.get("isSold")
      }
      if (item.isSold === false) {
        console.log(item)
        items.push(item);
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
      
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
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
        tokenURI,
        lazy: false
      }
      console.log(item)
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

    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

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
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }
      let item = {
        price: object.get("price"), 
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
        tokenURI: object.get("tokenURI"),
        voucher: object.get("voucher"),
        lazy: true,
        isSold: object.get("isSold")
      }
      console.log(item.isSold, "This item is stated as this")
      if (item.isSold === false) {
        items.push(item);
        console.log(item.image)
      }
    }

    

    await Promise.all(dataStorage.map(async i => {
      console.log(i)
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
      
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
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
        tokenURI,
        lazy: false
      }
      items.push(item)
      console.log(item)
    }))

    
    return items;
  }

export const fetchOwnedIds = async(marketAddress, marketContractABI, storageAddress, storageContractABI) => {
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   
    const contractABIJson = JSON.parse(marketContractABI);
    const storageContractABIJson = JSON.parse(storageContractABI);

    Moralis.start({ serverUrl, appId});

    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const signerAddress = await signer.getAddress();

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)
    const dataStorage = await storageContract.fetchMyNFTs()

    let imageLink = ''
    const items=[]
    
    await Promise.all(dataStorage.map(async i => {
      if (i.tokenId.toString() === '0') {
        console.log('mothafucka')
        return;
      }
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
        }
      }
      
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        seller: i.seller,
        artist: i.publisher,
        artistPhoto: await fetchArtistPhoto(i.publisher),
        artistName: await fetchArtistName(i.publisher),
        ownerPhoto: await fetchArtistPhoto(i.owner),
        ownerName: await fetchArtistName(i.owner),
        tokenAddress: i.tokenAddress,
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI,
        lazy: false
      }
      items.push(item)
    }))


    return items;
  }

