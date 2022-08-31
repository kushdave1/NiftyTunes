import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import LiveCollectionLayout from "components/nftylayouts/LiveCollectionLayout";
import LiveCollectionLayoutMobile from "components/nftylayouts/LiveCollectionLayoutMobile";
import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useIPFS } from "hooks/useIPFS";
import { fetchArtistPhoto, fetchArtistName } from '../nftyFunctions/fetchCloudData'
import { FetchLiveTokenURI } from '../nftyFunctions/FetchLiveTokenIds'
import { APP_ID, SERVER_URL } from "../../index"


function LiveCollectionIds() {

  const { resolveLink } = useIPFS();
  const [width, setWindowWidth] = useState()
  const {isAuthenticated, user} = useMoralis();
  const [collections, setCollections] = useState([]);
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, nftyLazyFactoryAddress } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const storageContractABIJson = JSON.parse(storageContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(async() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    try {
        let collectionIds = await GetCollections()
        console.log(collectionIds)
        setCollections(collectionIds)
        
    } catch (error) {
        console.log(error)
        setCollections([])

    }

    setTimeout(() => {
      setLoading(false)
    }, 500);
    return () => window.removeEventListener("resize",updateDimensions);
  }, []);

  const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

  const responsive = {
    showTopNavMenu: width > 1023
  }


    const GetCollections = async() => {

        let items = []
        const appId = APP_ID;
        const serverUrl = SERVER_URL;   
        Moralis.start({ serverUrl, appId});

        const Collections = Moralis.Object.extend("LiveMintedCollections")
        const query = new Moralis.Query(Collections)
        const results = await query.find()

        for (const i in results) {
            console.log(i)
            const object = results[i]
            console.log(object)
            let item = {
                
                name: object.get("CollectionName"),
                symbol: object.get("CollectionSymbol"),
                cover: object.get("CoverArtURL"),
                banner: object.get("bannerImageURL"),
                date: object.get("date"),
                description: object.get("description"),
                mintAddress: object.get("liveMintAddress"),
                auctionAddress: object.get("liveAuctionAddress"),
                signerAddress: object.get("signerAddress")
            }
            items.push(item)
        }
        return items

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

              (responsive.showTopNavMenu) ? (

            (collections &&
              collections.map((nft, index) => {
                return (
                    <LiveCollectionLayout collection={nft}
                    />
                )}
              ))
              ) : (
              (collections &&
              collections.map((nft, index) => {
                return (
                    <LiveCollectionLayoutMobile collection={nft}
                    />
                )}
              ))
              )
          }
    </React.Fragment>
  );
}

export default LiveCollectionIds