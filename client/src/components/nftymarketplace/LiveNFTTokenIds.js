import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';


import LiveMintFactory from '../../contracts/LiveMint.sol/LiveMintFactory.json';

import Col from 'react-bootstrap/Col'

import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useIPFS } from "hooks/useIPFS";
import { fetchArtistPhoto, fetchArtistName } from '../nftyFunctions/fetchCloudData'
import { FetchLiveTokenURI, FetchLiveOwner, FetchAuctionId } from '../nftyFunctions/FetchLiveTokenIds'
import { checkFileType } from '../nftyFunctions/checkFileType'

import ProductCardsLayoutLiveAdmin from '../nftylayouts/ProductCardsLayoutLiveAdmin'
import ProductCardsLayoutLive from "components/nftylayouts/ProductCardsLayoutLive";

import ProductCardsLayoutLiveAdminMobile from '../nftylayouts/ProductCardsLayoutLiveAdminMobile'
import ProductCardsLayoutLiveMobile from "components/nftylayouts/ProductCardsLayoutLiveMobile";

function LiveNFTTokenIds({auction, responsive}) {

  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
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
    console.log(responsive, "Hello maam")
    handleNFTs()
    
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, []);
 

    const handleNFTs = async() => {


        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()


        setRealSignerAddress(signerAddress)
        setAuctionSignerAddress(auction.signerAddress)



        const tokenURIBackup = auction.coverArt
        console.log(auction.fileType, "FILETYPEYALL")
        console.log(tokenURIBackup)
        let items = []
        let length = parseInt(auction.mintNumber)
        let totalMinted = 0;
 
          let nftsMinted = auction.editionsPerAuction[0]
          totalMinted = totalMinted + nftsMinted
     
      

        let tokenURI = ""
        let tokenId
        let name = ""
        let description = ""
        let imageLink = ""
        let sold
        let owner = ""
        let ownerName = ""
        let fileTypeFinal = ""
        const artistName = await fetchArtistName(auction.signerAddress)
        const artistPhoto = await fetchArtistPhoto(auction.signerAddress)
        console.log(auctionSignerAddress, realSignerAddress)
        console.log(artistName)
        let auctionCounter = 0;
        let auctionId;
        for (let i = 0; i < totalMinted; i++) {
            try {
                tokenURI = await FetchLiveTokenURI( auction.mintAddress, auction.mintNumber, i, auction.coverArt )
            } catch (error) {
                console.log(error)
            }

            if (tokenURI != "") {
                const meta = await axios.get(fixURL(tokenURI))
                for (const k in meta.data) {
                    if ((meta.data[k]).toString().includes('ipfs')) {
                        imageLink = meta.data[k]
                     }
                }
                fileTypeFinal = checkFileType(imageLink)
                name = meta.data.name
                description = meta.data.description
                sold = true
                
                const liveMintFactory = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
                const liveMintFactoryContract = liveMintFactory.attach(auction.mintAddress);
                try {
                    console.log(i, "this is the tokenId")
                    owner = await liveMintFactoryContract.ownerOf(i)
                    
                } catch {
                    owner = ""
                }
                console.log(owner, i, "ownerOFTOKEN")
                auctionId = auctionCounter
                ownerName = await fetchArtistName(owner)
                console.log(ownerName, 'ownername')
            } else {
                if (i!=0) {
                  auctionCounter = auctionCounter + 1
                }
                name = auction.collectionName.concat(` #${i}`)
                description = auction.collectionDescription
                imageLink = auction.coverArt
                sold = false
                owner = ""
                auctionId = auctionCounter
                ownerName=""
                fileTypeFinal=auction.fileType
                

            }
            console.log(fileTypeFinal, "FINALYALL")
            setNFTs(previousNFTs => [...previousNFTs, {
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
                  fileType: fileTypeFinal

            }])
          
        }

        
        
        
    }

  return (
    <React.Fragment>
          {loading?
              //render skeleton when loading
            (Array(6)
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
                    mintAddress={auction.mintAddress} editionsPerAuction={auction.editionsPerAuction} signerAddress={auction.signerAddress}
                    sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} fileType={nft.fileType}
                    />
                    
                )
                }
              
              ))
            ) : (
                (nfts &&
              nfts.map((nft, index) => {
                
                return (
                    <ProductCardsLayoutLive index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={auction.collectionName} image={nft.image} name={nft.name} coverArt={nft.coverArt}
                    description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                    mintAddress={auction.mintAddress} editionsPerAuction={auction.editionsPerAuction} signerAddress={auction.signerAddress}
                    sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} fileType={nft.fileType}
                    />
                    
                )
                }
              
              ))

            )
          ) : (
            (auctionSignerAddress===realSignerAddress) ? (
            (nfts &&
              nfts.map((nft, index) => {
                
                return (
                  
                    <ProductCardsLayoutLiveAdminMobile index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={auction.collectionName} image={nft.image} coverArt={nft.coverArt}
                    name={nft.name} description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                    mintAddress={auction.mintAddress} editionsPerAuction={auction.editionsPerAuction} signerAddress={auction.signerAddress}
                    sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} fileType={nft.fileType}
                    />
                  
                    
                )
                }
              
              ))
            ) : (
                (nfts &&
              nfts.map((nft, index) => {
                
                return (
                 
                    <ProductCardsLayoutLiveMobile index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={auction.collectionName} image={nft.image} name={nft.name} coverArt={nft.coverArt}
                    description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                    mintAddress={auction.mintAddress} editionsPerAuction={auction.editionsPerAuction} signerAddress={auction.signerAddress}
                    sold={nft.sold} owner={nft.owner} auctionId={nft.auctionId} ownerName={nft.ownerName} fileType={nft.fileType}
                    />
                 
                    
                )
                }
              
              ))

            )
          )
          }
    </React.Fragment>
  );
}

export default LiveNFTTokenIds