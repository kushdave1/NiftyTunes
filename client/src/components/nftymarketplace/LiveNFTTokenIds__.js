import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { GetProvider } from '../nftyFunctions/GetProvider'

import { checkIfNewImage, handleNewImage, checkIfNewTokenURI } from './NFTHelper/checkNewImage'


import LiveMintFactory from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintFactory.json';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Carousel from 'react-bootstrap/Carousel'

import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useIPFS } from "hooks/useIPFS";
import { fetchArtistPhoto, fetchArtistName } from '../nftyFunctions/fetchCloudData'
import { FetchLiveTokenURI, FetchLiveOwner, FetchAuctionId } from '../nftyFunctions/FetchLiveTokenIds'
import { checkFileType } from '../nftyFunctions/checkFileType'
import { useMoralisQuery } from "react-moralis";

import ProductCardsLayoutLiveAdmin from '../nftylayouts/ProductCardsLayoutLiveAdmin'
import ProductCardsLayoutLive from "components/nftylayouts/ProductCardsLayoutLive";

import { APP_ID, SERVER_URL } from "../../index"

import ProductCardsLayoutLiveAdminMobile from '../nftylayouts/ProductCardsLayoutLiveAdminMobile'
import ProductCardsLayoutLiveMobile from "components/nftylayouts/ProductCardsLayoutLiveMobile";

function LiveNFTTokenIds({auction, auctionAddress, mintAddress, responsive}) {

  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const [finalNFTs, setFinalNFTs] = useState()
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, nftyLazyFactoryAddress } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);
  const [realSignerAddress, setRealSignerAddress] = useState("")
  const [auctionSignerAddress, setAuctionSignerAddress] = useState("")

  const appId = APP_ID;
  const serverUrl = SERVER_URL;   
  Moralis.start({ serverUrl, appId});


  const { fetch } = useMoralisQuery(
      "LiveNFTs",
      (query) => query.equalTo("mintAddress", mintAddress),
      [],
      {
        live: true,
      }
  );

  useEffect(async() => {
    const LiveNFTs = await fetch()
    
    if (!isAuthenticated) {
      await setFirstNFTs()
        setTimeout(() => {
        setLoading(false)
        }, 500);
      return
    }
    


    if (LiveNFTs.length !== 0) {
      await setFirstNFTs()
      setTimeout(() => {
        setLoading(false)
      }, 500);
    }
    // } else {

      // await setFirstNFTs()
      // setTimeout(() => {
      // setLoading(false)
      // }, 500);
      let finalItems


      finalItems = await setNFTArray()
        
      await setNFTArrayFull(finalItems)
      setTimeout(() => {
        setLoading(false)
        }, 500);

      //await filterLiveNFTs()

    
    
  }, []);

  


  const filterLiveNFTs = async() => {
    let liveNFTs = await fetch()
    let itemsFiltered = []
    console.log(liveNFTs, liveNFTs.length, "FLEMA")

    if (liveNFTs.length > 1) {
      for (const i in liveNFTs) {
        for (const j in liveNFTs) {

        
          let item = liveNFTs[i]
          let tokenIdOne = liveNFTs[i].get("tokenId")
          let tokenIdTwo = liveNFTs[j].get("tokenId")
          if (tokenIdOne === tokenIdTwo && i !== j) {
            itemsFiltered.push(item)
          }
          
        }
      }
        
      }
      console.log(itemsFiltered, "DOI+BLw")
      for (const i in itemsFiltered) {
        if (i !== 0) {
          itemsFiltered[i].destroy({useMasterKey: true}).then(() => console.log("deleted successfully"))
        }
      
      }

    }
        


  const setFirstNFTs = async() => {
        setAuctionSignerAddress(auction.signerAddress)
        let signer
        let liveMintFactory
        let liveMintFactoryContract

        const LiveNFTsNew = await Moralis.Object.extend("LiveNFTs")
        const query = new Moralis.Query(LiveNFTsNew)
      
        query.equalTo("mintAddress", auction.mintAddress).equalTo("tier", auction.tier)
        const LiveNFTs = await query.find({useMasterKey: true})
        //let items = LiveNFTs[0].get("nfts")
        let itemsArray = []
        let finalItems = []
        
        

        for (const i in LiveNFTs) {
      
            let fileType = LiveNFTs[i].get("fileType")

            if (fileType) {
              fileType = LiveNFTs[i].get("fileType")
              console.log(fileType, "WRA")

            } else {
              let imageReal = LiveNFTs[i].get("image")
              console.log(imageReal)
              fileType = await checkFileType(imageReal)
              console.log(fileType, "WRO")
       
            }
            itemsArray.push(
              {
                  tokenId: LiveNFTs[i].get("tokenId"),
                  name: LiveNFTs[i].get("name"),
      
                  image: LiveNFTs[i].get("image"),
                  description: LiveNFTs[i].get("description"),
                  artistName: LiveNFTs[i].get("artistName"),
                  artistPhoto: LiveNFTs[i].get("artistPhoto"),
                  coverArt: LiveNFTs[i].get("coverArt"),
                  sold: LiveNFTs[i].get("sold"),
                  owner: LiveNFTs[i].get("owner"),
                  ownerName: LiveNFTs[i].get("ownerName"),
                  ownerPhoto: LiveNFTs[i].get("ownerPhoto"),
                  fileType: fileType,
                  tier: LiveNFTs[i].get("tier"),
                  date: LiveNFTs[i].get("date"),
                  location: LiveNFTs[i].get("location")

            }) 
            

          //itemsArray.push(items[i])

          if (itemsArray.length === 3 || itemsArray.length !== 3 && parseInt(i) + 1 === LiveNFTs.length) {
            finalItems.push(itemsArray)
            itemsArray = []
          }     

        }

        setFinalNFTs(finalItems)

      }

    const checkIfNewOwner = async(liveMint, i) => {
        let signer
        let liveMintFactory
        let liveMintFactoryContract
        let owner
        if (isAuthenticated) {
            signer = await ConnectWallet()
            liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)
      
            setRealSignerAddress(signer.getAddress())
        } else {
            signer = GetProvider()
            liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)
            setRealSignerAddress("")
        }
        console.log(liveMint.owner, "SALS")

        try {
            
            owner = await liveMintFactoryContract.ownerOf(i)
            
        } catch (error) {
            console.log(error, "QOLELS")
            owner = ""
        }
        if (liveMint.owner === owner || owner==="") {
          return false
        } else {
          return true
        }

      }

  
  


  const setNFTArray = async() => {
    const LiveNFTs = await fetch()

    
    let signer
    let liveMintFactory
    let liveMintFactoryContract
    let tokenURI = ""
    let tokenId
    let name = ""
    let description = ""
    let imageLink = ""
    let sold
    let owner = ""
    let ownerName = ""
    let fileTypeFinal = ""
    let ownerPhoto = ""
    let location
    let date
    let auctionId = 0
    const artistName = await fetchArtistName(auction.signerAddress)
    const artistPhoto = await fetchArtistPhoto(auction.signerAddress)
    const tokenURIBackup = auction.coverArt
    let items = []
    let length = parseInt(auction.mintNumber)
    let totalMinted = 0;
    let nftsMinted = auction.editionsPerAuction[0]
    totalMinted = totalMinted + nftsMinted

    if (isAuthenticated) {
        signer = await ConnectWallet()
        liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)

        setRealSignerAddress(signer.getAddress())
    } else {
        signer = GetProvider()
        liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)
        setRealSignerAddress("")
    }

    let count = 0


    for (let i = 0; i < auction.nftsToMint; i++) {

      count +=1
      console.log(count, "SEE")

      console.log(auction.nftsToMint, "DEar")
      try {
          tokenURI = await FetchLiveTokenURI( auction.mintAddress, auction.mintNumber, i, auction.coverArt, isAuthenticated )
          console.log(tokenURI, "DEEDOM")
      } catch (error) {
          console.log(error, "Deedom")
      }

      if (tokenURI !== "") {
          const meta = await axios.get(fixURL(tokenURI))
          for (const k in meta.data) {
              if ((meta.data[k]).toString().includes('ipfs')) {
                  imageLink = meta.data[k]
                }
          }
          location = meta.data.location
          date = meta.data.date
          fileTypeFinal = await checkFileType(imageLink)
          name = meta.data.name
          description = meta.data.description
          sold = true

          try {
              
              owner = await liveMintFactoryContract.ownerOf(i)
          } catch (error) {
              owner = ""
              console.log("EMKAL", error)
          }

          ownerName = await fetchArtistName(owner)
          ownerPhoto = await fetchArtistPhoto(owner)
      } else {
          name = auction.collectionName.concat(` #${i+1}`)
          description = auction.collectionDescription

          imageLink = handleNewImage(auction.tier, auction.Legendary, auction.Rare, auction.Common, auction.coverArt)
          
          
          sold = false
          date = auction.date
          location = auction.location
          owner = ""
          ownerName=""
          ownerPhoto=""
          if (imageLink.includes("moralis")) {
            fileTypeFinal=auction.fileType
          } else {
            fileTypeFinal= await checkFileType(imageLink)
          }
          
          
      }

      items.push(
        {
            tokenId: i,
            auctionId: auctionId,
            name: name,
            symbol: auction.collectionSymbol,
            image: imageLink,
            description: description,
            artistName: artistName,
            artistPhoto: artistPhoto,
            coverArt: auction.coverArt,
            sold: sold,
            owner: owner,
            ownerName: ownerName,
            ownerPhoto: ownerPhoto,
            fileType: fileTypeFinal,
            tier: auction.tier,
            date: date,
            location: location

      }) 

    

      

      if (LiveNFTs.length !== 0) {

        let mintAddress = LiveNFTs[0].get("mintAddress")

        let fileTypeLocal = fileTypeFinal
        let imageLocal = imageLink
        let ownerLocal = owner

        let fileTypeCache = LiveNFTs[0].get("fileType")
        let imageCache = LiveNFTs[0].get("image")
        let ownerCache = LiveNFTs[0].get("owner")

        if (fileTypeLocal !== fileTypeCache || imageLocal !== imageCache || ownerLocal !== ownerCache) {

          LiveNFTs[0].set("fileType", fileTypeLocal)
          LiveNFTs[0].set("image", imageLocal)
          LiveNFTs[0].set("owner", ownerLocal)
          await LiveNFTs[0].save()

        }

      } else {

        let ipa = await checkFileType(imageLink)

        console.log(imageLink, "HUMVLw")

        const LiveNFTsPerAuction = Moralis.Object.extend("LiveNFTs")
        const liveNFT = new LiveNFTsPerAuction()
        liveNFT.set("mintAddress", mintAddress)
        liveNFT.set("tokenId", i)
        liveNFT.set("name", name)
        liveNFT.set("image", imageLink)
        liveNFT.set("description", description)
        liveNFT.set("artistName", artistName)
        liveNFT.set("artistPhoto", artistPhoto)
        liveNFT.set("ownerName", ownerName)
        liveNFT.set("owner", owner)
        liveNFT.set("sold", sold)
        liveNFT.set("coverArt", auction.coverArt)
        liveNFT.set("ownerPhoto", ownerPhoto)
        liveNFT.set("fileType", fileTypeFinal)
        liveNFT.set("tier", auction.tier)
        liveNFT.set("date", date)
        liveNFT.set("location", location)
        liveNFT.set("signerAddress", auction.signerAddress)

        let liveNFTParse=[]

        const LiveNFTsNew = await Moralis.Object.extend("LiveNFTs")
        const query = new Moralis.Query(LiveNFTsNew)
        query.equalTo("mintAddress", auction.mintAddress).equalTo("tier", auction.tier).equalTo("tokenId", i)

        const data = await query.find({useMasterKey: true})

        console.log(data, "TREE")

        if (data.length > 0) {
          console.log(data)
        } else {
          await liveNFT.save()
        }

        

      }
      
      

    }

    return items
    // let itemsArray = []
    // let finalItems = []

    

    // for (const i in items) {
    //   itemsArray.push(items[i])
    //   console.log(parseInt(i)+ 1, items.length, "BMEL")

    //   if (itemsArray.length === 3 || itemsArray.length !== 3 && parseInt(i) + 1 === items.length) {
    //     finalItems.push(itemsArray)
    //     itemsArray = []
    //   }      

    // }

    // console.log(finalItems, "MESSY")

    // setFinalNFTs(finalItems)
  }


  const setNFTArrayFull = (items) => {
    
    let itemsArray = []
    let finalItems = []

    

    for (const i in items) {
      itemsArray.push(items[i])
      console.log(parseInt(i)+ 1, items.length, "BMEL")

      if (itemsArray.length === 3 || itemsArray.length !== 3 && parseInt(i) + 1 === items.length) {
        finalItems.push(itemsArray)
        itemsArray = []
      }      

    }

    console.log(finalItems, "MESSY")

    setFinalNFTs(finalItems)
  }

      
    

  return (
    <Carousel style={{width: responsive ? "90vw" : "90vw", marginTop: responsive ? "-20px": "0px"}} 
    pause="hover" indicators={false} prevIcon="" prevName=""
    nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}> 
          {loading?
              //render skeleton when loading
            (Array(1)
            .fill()
            .map((item, index) => {
                return(
                    <ProductSkeleton key={index} />
                )
              })) :
          (responsive) ? (
            (auctionSignerAddress===realSignerAddress) ? (
            (nfts &&
              nfts.map((nft, index) => {
                
                return (
                    <ProductCardsLayoutLiveAdmin index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={auction.collectionName} image={nft.image} coverArt={nft.coverArt}
                    name={nft.name} description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                    mintAddress={auction.mintAddress} editionsPerAuction={auction.nftsToMint} signerAddress={auction.signerAddress}
                    sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} ownerPhoto={nft.ownerPhoto} fileType={nft.fileType}
                    />
                    
                )
                }
              
              ))
            ) : (
          (
                  
              finalNFTs &&
              finalNFTs.map((nfts, index) => {
                return (
    
                  <Carousel.Item style={{width: 
                  "85vw", paddingLeft: "20px"}}>
                  <Row style={{width: 
                  "85vw"}}>
                  {nfts.map((nft, index) => {
                
                  return (
                    
                      <ProductCardsLayoutLive index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                      collection={auction.collectionName} image={nft.image} name={nft.name} coverArt={nft.coverArt}
                      description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                      mintAddress={auction.mintAddress} editionsPerAuction={auction.nftsToMint} signerAddress={auction.signerAddress}
                      sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} ownerPhoto={nft.ownerPhoto}
                      fileType={nft.fileType} nftFrom="Collection"
                      />
                      
                    )
                  }
                )}
                </Row>
                </Carousel.Item>
        
              )
            })
          )

            )
          ) : (
            (auctionSignerAddress===realSignerAddress) ? (
            (nfts &&
              nfts.map((nft, index) => {
                
                return (
                  
                    <ProductCardsLayoutLiveAdminMobile index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={auction.collectionName} image={nft.image} coverArt={nft.coverArt}
                    name={nft.name} description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                    mintAddress={auction.mintAddress} editionsPerAuction={auction.nftsToMint} signerAddress={auction.signerAddress}
                    sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} ownerPhoto={nft.ownerPhoto}
                    fileType={nft.fileType} nftFrom="Collection"
                    />
                  
                    
                )
                }
              
              ))
            ) : (
                 (
                  
              finalNFTs &&
              finalNFTs.map((nfts, index) => {
                return (
    
                  <Carousel.Item style={{ width:"90vw"}}>
 
       
                  {nfts.map((nft, index) => {
                
                  return (
                    
                      <ProductCardsLayoutLiveMobile index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                      collection={auction.collectionName} image={nft.image} name={nft.name} coverArt={nft.coverArt}
                      description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                      mintAddress={auction.mintAddress} editionsPerAuction={auction.nftsToMint} signerAddress={auction.signerAddress}
                      sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} ownerPhoto={nft.ownerPhoto}
                      fileType={nft.fileType} nftFrom="Collection"
                      />
                      
                    )
                  }
                )}
  
                </Carousel.Item>
        
              )
            })
          )

            )
          )
          }
    </Carousel>
  );
}

export default LiveNFTTokenIds