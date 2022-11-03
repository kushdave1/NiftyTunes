import Moralis from 'moralis'
import { fetchArtistPhoto, fetchArtistName } from './fetchCloudData'
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import { fixURL, fixImageURL } from './fixURL'
import { useIPFS } from "hooks/useIPFS";
import { APP_ID, SERVER_URL } from "../../index"
import { ConnectWallet } from "./ConnectWallet"
import { checkFileType } from "./checkFileType"

export const fetchFullTokenIds = async(saveFile) => {
  const appId = APP_ID;
  const serverUrl = SERVER_URL;   

  Moralis.start({ serverUrl, appId});

  const signer = await ConnectWallet()

  const signerAddress = await signer.getAddress();

  const LiveNFTs = await Moralis.Object.extend("LiveNFTs");

  const query = new Moralis.Query(LiveNFTs);

  const data = await query.find();

  let dataFinal = []

  const items = []

  let image = ''
  let imageLink = ''

  

  for (const i in data) {
    const object = data[i];

    let image = object.get("image")

    let fileType = object.get("fileType")


    const meta = fixURL(image)

    const response = await fetch(meta)
    
    const blob = await response.blob()
    console.log(blob, "BLOB")

    let myFile
    let myFileType
    let myFileName

    if (fileType.includes("image")) {
      myFile = new File([blob], 'image.jpeg', {
          type: blob.type,
      });
      myFileType="image/png"
      myFileName="photo.jpg"
    } else {
      myFile = new File([blob], 'video.mp4', {
        type: blob.type,
      });
      myFileType="video/mp4"
      myFileName="video.mp4"
    }

    let url = URL.createObjectURL(myFile, {type: myFileType})

    object.set('imageCacheURL', url)

    // await saveFile(myFileName, myFile, {
    //     type: myFileType,
    //     onSuccess: (result) => {object.set('imageCache', result); object.set('imageCacheURL', result.url());},
    //     onError: (error) => console.log(error),
    // });

    await object.save()

    console.log(myFile, "SCREAM")




    // for (const j in meta.data) {
    //   if ((meta.data[j]).toString().includes('ipfs')) {
    //       imageLink = meta.data[j]
    //   }
    // }

    let item = {
      fileType: object.get("fileType"),

      tokenId: object.get("tokenId"),
      artist: object.get("artist"),
      owner: object.get("owner"),
      artistPhoto: object.get("artistPhoto"),
      artistName:  object.get("artistName"),
      ownerPhoto: object.get("owner"),
      ownerName: object.get("ownerName"),
      coverPhotoURL: object.get("coverPhotoURL"),
      gallery: object.get("galleryAddress"),
      image: image,
      isSold: false,
      name: object.get("name"),
      description: object.get("description"),
      tier: object.get("tier"),
      location: object.get("location"),
      date: object.get("date"),
      mintAddress: object.get("mintAddress"),
      signerAddress: object.get("signerAddress")
      
    }
    items.push(item)
  }
  let i = 0
  let j = 0

  // while (i < items.length) {
  //   while (j < items.length) {
  //     let itemOne = items[i]
  //     let itemTwo = items[j]
  //     if (itemOne.tier === itemTwo.tier && itemOne.mintAddress === itemTwo.mintAddress && itemOne.tokenId === itemTwo.tokenId) {
  //       items.splice(j, 1)
        
  //       j++
  //     } else {
  //       items.push(itemTwo)
  //       j++
  //     }
  //   }
  //   i++
    


  // }
    


    
    
  

  // const dataStorage = await storageContract.fetchMarketItems()

  // await Promise.all(dataStorage.map(async i => {
  //   if (i.tokenId.toString() === '0') {
  //     return;
  //   }
  //   const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

  //   const meta = await axios.get(fixURL(tokenURI))
  //   for (const j in meta.data) {
  //     if ((meta.data[j]).toString().includes('ipfs')) {
  //         imageLink = meta.data[j]
  //     }
  //   }

  //   const fileType = await checkFileType(imageLink)


  //   let artistPhoto = await fetchArtistPhoto(i.publisher)
  //   let artistName = await fetchArtistName(i.publisher)
  //   let ownerPhoto = await fetchArtistPhoto(i.owner)
  //   let ownerName = await fetchArtistName(i.owner)

  //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
  //   let item = {
  //     price,
  //     fileType: fileType,
  //     tokenId: i.tokenId.toNumber(),
  //     owner: i.owner,
  //     seller: i.seller,
  //     artist: i.publisher,
  //     artistPhoto: artistPhoto,
  //     artistName: artistName,
  //     ownerPhoto: ownerPhoto,
  //     ownerName: ownerName,
  //     image: imageLink,
  //     name: meta.data.name,
  //     description: meta.data.description,
  //     tier: meta.data.tier,
  //     tokenURI,
  //     lazy: false,
  //     isSold: true,
  //     tokenAddress: i.tokenAddress,

  //   }

  //   items.push(item)
  // }))


  return items;
}
 

export const fetchGalleryTokenIds = async() => {
    const appId = APP_ID;
    const serverUrl = SERVER_URL;   

    Moralis.start({ serverUrl, appId});

    const signer = await ConnectWallet()

    const signerAddress = await signer.getAddress();

    const LiveNFTs = await Moralis.Object.extend("LiveNFTs");

    const query = new Moralis.Query(LiveNFTs).limit(12);

    const data = await query.find();

    let dataFinal = []

    const items = []

    let image = ''
    let imageLink = ''

    

    for (const i in data) {
      const object = data[i];

      let image = object.get("image")


      // const meta = await axios.get(fixURL(object.get("tokenURI")))
      // for (const j in meta.data) {
      //   if ((meta.data[j]).toString().includes('ipfs')) {
      //       imageLink = meta.data[j]
      //   }
      // }

      const fileType = await checkFileType(image)
      let item = {
        fileType: fileType,

        tokenId: object.get("tokenId"),
        artist: object.get("artist"),
        owner: object.get("owner"),
        artistPhoto: object.get("artistPhoto"),
        artistName:  object.get("artistName"),
        ownerPhoto: object.get("owner"),
        ownerName: object.get("ownerName"),
        coverPhotoURL: object.get("coverPhotoURL"),
        gallery: object.get("galleryAddress"),
        image: image,
        isSold: false,
        name: object.get("name"),
        description: object.get("description"),
        tier: object.get("tier"),
        location: object.get("location"),
        date: object.get("date"),
        mintAddress: object.get("mintAddress"),
        signerAddress: object.get("signerAddress")
        
      }
      items.push(item)
    }
    let i = 0
    let j = 0

    // while (i < items.length) {
    //   while (j < items.length) {
    //     let itemOne = items[i]
    //     let itemTwo = items[j]
    //     if (itemOne.tier === itemTwo.tier && itemOne.mintAddress === itemTwo.mintAddress && itemOne.tokenId === itemTwo.tokenId) {
    //       items.splice(j, 1)
          
    //       j++
    //     } else {
    //       items.push(itemTwo)
    //       j++
    //     }
    //   }
    //   i++
      


    // }
      


      
      
    

    // const dataStorage = await storageContract.fetchMarketItems()

    // await Promise.all(dataStorage.map(async i => {
    //   if (i.tokenId.toString() === '0') {
    //     return;
    //   }
    //   const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

    //   const meta = await axios.get(fixURL(tokenURI))
    //   for (const j in meta.data) {
    //     if ((meta.data[j]).toString().includes('ipfs')) {
    //         imageLink = meta.data[j]
    //     }
    //   }

    //   const fileType = await checkFileType(imageLink)


    //   let artistPhoto = await fetchArtistPhoto(i.publisher)
    //   let artistName = await fetchArtistName(i.publisher)
    //   let ownerPhoto = await fetchArtistPhoto(i.owner)
    //   let ownerName = await fetchArtistName(i.owner)

    //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    //   let item = {
    //     price,
    //     fileType: fileType,
    //     tokenId: i.tokenId.toNumber(),
    //     owner: i.owner,
    //     seller: i.seller,
    //     artist: i.publisher,
    //     artistPhoto: artistPhoto,
    //     artistName: artistName,
    //     ownerPhoto: ownerPhoto,
    //     ownerName: ownerName,
    //     image: imageLink,
    //     name: meta.data.name,
    //     description: meta.data.description,
    //     tier: meta.data.tier,
    //     tokenURI,
    //     lazy: false,
    //     isSold: true,
    //     tokenAddress: i.tokenAddress,

    //   }

    //   items.push(item)
    // }))


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

