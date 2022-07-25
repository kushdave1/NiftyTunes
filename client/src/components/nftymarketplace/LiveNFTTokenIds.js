import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import ProductCardsLayoutLive from "components/nftylayouts/ProductCardsLayoutLive";
import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useIPFS } from "hooks/useIPFS";
import { fetchArtistPhoto, fetchArtistName } from '../nftyFunctions/fetchCloudData'
import { FetchLiveTokenURI } from '../nftyFunctions/FetchLiveTokenIds'
import ProductCardsLayoutLiveAdmin from '../nftylayouts/ProductCardsLayoutLiveAdmin'

function LiveNFTTokenIds({auction}) {

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
    console.log(auction)
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
        console.log(tokenURIBackup)
        let items = []
        let length = parseInt(auction.mintNumber)
        let tokenURI = ""
        let name = ""
        let description = ""
        let imageLink = ""
        const artistName = await fetchArtistName(auction.signerAddress)
        const artistPhoto = await fetchArtistPhoto(auction.signerAddress)
        console.log(auctionSignerAddress, realSignerAddress)
        console.log(artistName)
        for (let i = 0; i < length; i++) {
            try {
                tokenURI = await FetchLiveTokenURI( auction.mintAddress, auction.mintNumber, i, auction.coverArt )
            } catch (error) {
                console.log(error)
            }

            if (tokenURI != "") {
                console.log(tokenURI, "I am a cocksucker", i)
                const meta = await axios.get(fixURL(tokenURI))
                for (const j in meta.data) {
                    if ((meta.data[j]).toString().includes('ipfs')) {
                        imageLink = meta.data[j]
                     }
                }
                name = meta.data.name
                description = meta.data.description
            } else {
                name = auction.collectionName.concat(` #${i}`)
                description = auction.collectionDescription
                imageLink = auction.coverArt
            }

            setNFTs(previousNFTs => [...previousNFTs, {
                tokenId: i,
                name: name,
                symbol: auction.collectionSymbol,
                image: imageLink,
                description: description,
                artistName: artistName,
                artistPhoto: artistPhoto,
                coverArt: auction.coverArt
            }])
        }
        console.log(nfts)
        
        
        
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
              //render nfts when finished loading
            (auctionSignerAddress===realSignerAddress) ? (
            (nfts &&
              nfts.map((nft, index) => {
                
                return (
                    <ProductCardsLayoutLiveAdmin index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={auction.collectionName} image={nft.image} coverArt={nft.coverArt}
                    name={nft.name} description={nft.description} nft={nft} auctionAddress={auction.auctionAddress}
                    mintAddress={auction.mintAddress}
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
                    mintAddress={auction.mintAddress}
                    />
                    
                )
                }
              
              ))

            )
          }
    </React.Fragment>
  );
}

export default LiveNFTTokenIds