import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { GetProvider } from '../nftyFunctions/GetProvider'


import LiveMintFactory from '../../contracts/LiveMint.sol/LiveMintFactory.json';

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

import ProductCardsLayoutLiveAdminMobile from '../nftylayouts/ProductCardsLayoutLiveAdminMobile'
import ProductCardsLayoutLiveMobile from "components/nftylayouts/ProductCardsLayoutLiveMobile";

function LiveNFTTokenIdsNoCar({auction, auctionAddress, responsive}) {

  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const [finalNFTs, setFinalNFTs] = useState()
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, nftyLazyFactoryAddress } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const storageContractABIJson = JSON.parse(storageContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);
  const [realSignerAddress, setRealSignerAddress] = useState("")
  const [auctionSignerAddress, setAuctionSignerAddress] = useState("")
  
  useEffect(async() => {
    filterLiveNFTs()

    await handleNFTs()
    
    
    setTimeout(() => {
      setLoading(false)
    }, 500);
    
  }, []);

  const { fetch } = useMoralisQuery(
      "LiveNFTs",
      (query) => query.equalTo("auctionAddress", auctionAddress),
      [],
      { autoFetch: false }
  );


  const filterLiveNFTs = async() => {
    let liveNFTs = await fetch()

    if (liveNFTs.length > 1) {
      liveNFTs[1].destroy({useMasterKey: true})
    }
  }

  const handleNewImage = () => {
    let image
    if (auction.tier === 'Legendary' && auction.Legendary !== undefined) {
        image = auction.Legendary
    } else if (auction.tier === 'Rare' && auction.Rare !== undefined) {
        image = auction.Rare
    } else if (auction.tier === 'Common' && auction.Common !== undefined) {
        image = auction.Common
    } else {
      image = auction.coverArt
    }

    return image

  }


  const checkIfNewImage = (liveMint) => {
    let image
    if (auction.tier === 'Legendary' && liveMint.Legendary === undefined) {
        return true
    } else if (auction.tier === 'Rare' && liveMint.Rare === undefined) {
        return true
    } else if (auction.tier === 'Common' && liveMint.Rare === undefined) {
        return true
    } else {
      return false
    }

  }

  const checkIfNewTokenURI = async(liveMint, tokenURI) => {
    let imageLink
    console.log(liveMint, "STEAR")
    if (tokenURI !== "") {
      const meta = await axios.get(fixURL(tokenURI))
      for (const k in meta.data) {
          if ((meta.data[k]).toString().includes('ipfs')) {
              imageLink = meta.data[k]
            }
      }
    }

    if (liveMint.image !== imageLink) {
      return true
    } else {
      return false
    }
  }

  const checkIfNewOwner = async(liveMint, i) => {
    let signer
    let liveMintFactory
    let liveMintFactoryContract
    let owner
    if (isAuthenticated) {
        signer = await ConnectWallet()
        liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
        liveMintFactoryContract = liveMintFactory.attach(auction.mintAddress);
        setRealSignerAddress(signer.getAddress())
    } else {
        signer = GetProvider()
        liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)
        setRealSignerAddress("")
    }

    try {
        owner = await liveMintFactoryContract.ownerOf(i)
        console.log(owner, "FEAR")
        
    } catch {
        owner = ""
    }
    if (liveMint.owner === owner || owner==="") {
      return false
    } else {
      return true
    }

  }


  const setNFTArray = async() => {
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
        liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
        liveMintFactoryContract = liveMintFactory.attach(auction.mintAddress);
        setRealSignerAddress(signer.getAddress())
    } else {
        signer = GetProvider()
        liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)
        setRealSignerAddress("")
    }

    for (let i = 0; i < auction.nftsToMint; i++) {
      try {
          tokenURI = await FetchLiveTokenURI( auction.mintAddress, auction.mintNumber, i, auction.coverArt, isAuthenticated )
      } catch (error) {
          console.log(error)
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
          
          imageLink = handleNewImage()
          sold = false
          date = auction.date
          location = auction.location
          owner = ""
          ownerName=""
          ownerPhoto=""
          if (imageLink.includes("moralis")) {
            fileTypeFinal=auction.fileType
          } else {
            fileTypeFinal=await checkFileType(imageLink)
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
    }
    return items
  }
 

    const handleNFTs = async() => {
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

        const tokenURIBackup = auction.coverArt
        let items = []
        let length = parseInt(auction.mintNumber)
        let totalMinted = 0;
        let nftsMinted = auction.editionsPerAuction[0]
        totalMinted = totalMinted + nftsMinted
        const artistName = await fetchArtistName(auction.signerAddress)
        const artistPhoto = await fetchArtistPhoto(auction.signerAddress)

        setAuctionSignerAddress(auction.signerAddress)


    
        if (isAuthenticated) {
            signer = await ConnectWallet()
            liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
            liveMintFactoryContract = liveMintFactory.attach(auction.mintAddress);
            setRealSignerAddress(signer.getAddress())
        } else {
            signer = GetProvider()
            liveMintFactoryContract = new ethers.Contract(auction.mintAddress, LiveMintFactory.abi, signer)
            setRealSignerAddress("")
        }
      
        let auctionId;

        const LiveNFTs = await fetch()

        if (LiveNFTs.length === 0) {
          

          items = await setNFTArray()

          const LiveNFTsPerAuction = Moralis.Object.extend("LiveNFTs")
          const liveNFTs = new LiveNFTsPerAuction()
          liveNFTs.set("auctionAddress", auctionAddress)
          liveNFTs.set("nfts", items)
          
          await liveNFTs.save()

        } else {
          items = LiveNFTs[0].get("nfts")

          try {
              tokenURI = await FetchLiveTokenURI( auction.mintAddress, auction.mintNumber, 0, auction.coverArt, isAuthenticated )
          } catch (error) {
              console.log(error)
          }
          let image
          let LiveMint
          let liveMintAuction
          let liveMint
          let tier
          


          if (tokenURI === "") {
            image = handleNewImage()

            LiveMint = await fetch()
            liveMintAuction = LiveMint[0]

            liveMint = LiveMint[0].get("nfts")[0]

            
            if (!image.includes("moralis") && checkIfNewImage(liveMint)) {
              items = await setNFTArray()
              liveMintAuction.set("nfts", items)
              liveMintAuction.save()

            }     
          } else {
            LiveMint = await fetch()
            liveMintAuction = LiveMint[0]

            liveMint = LiveMint[0].get("nfts")
            if (await checkIfNewTokenURI(liveMint, tokenURI)) {
              
              items = await setNFTArray()
              liveMintAuction.set("nfts", items)
              liveMintAuction.save()
            }

            let checkNewOwner = false

            for (const i in liveMint) {
              
              if (await checkIfNewOwner(liveMint[i], i)) {
                items = await setNFTArray()
                liveMintAuction.set("nfts", items)
                liveMintAuction.save()
                break
              }
            }


            
            
          }

          console.log(items, "MEKE")
        }
      

        let itemsArray = []
        let finalItems = []


        for (const i in items) {
          itemsArray.push(items[i])
          console.log(parseInt(i)+ 1, items.length)

          if (itemsArray.length === 3 || itemsArray.length !== 3 && parseInt(i) + 1 === items.length) {
            finalItems.push(itemsArray)
            itemsArray = []
          }     

        }

        setFinalNFTs(finalItems)
     
      }
    

  return (
    <Carousel style={{width: responsive ? "90vw" : "90vw", marginTop: responsive ? "-20px": "0px"}} 
    pause="hover" indicators={false} prevIcon="" prevName=""
    nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}> 
          {loading?
              //render skeleton when loading
            (Array(4)
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
                  "85vw"}}>
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
                      fileType={nft.fileType}
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

export default LiveNFTTokenIdsNoCar