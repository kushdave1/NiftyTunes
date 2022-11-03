import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import ProductListLayout from "components/nftylayouts/ProductListLayout"
import ProductCardsLayoutLazy from "components/nftylayouts/ProductCardsLayoutLazy";
import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useIPFS } from "hooks/useIPFS";
import { fetchArtistPhoto, fetchArtistName } from '../nftyFunctions/fetchCloudData'
import { fetchGalleryTokenIds, fetchFullTokenIds } from '../nftyFunctions/FetchGalleryTokenIds'
import ProductCardsLayoutLiveAdmin from '../nftylayouts/ProductCardsLayoutLiveAdmin'
import ProductCardsLayoutLive from "components/nftylayouts/ProductCardsLayoutLive";

import ProductCardsLayoutLiveAdminMobile from '../nftylayouts/ProductCardsLayoutLiveAdminMobile'
import ProductCardsLayoutLiveMobile from "components/nftylayouts/ProductCardsLayoutLiveMobile";

import {useRaribleLazyMint,  useMoralisFile} from 'react-moralis'
import { useFilterGallery } from "../../providers/GalleryProvider/FilterGalleryProvider";

function GalleryTokenIds() {

  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const { saveFile } = useMoralisFile();
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, nftyLazyFactoryAddress } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);
  const { galleryTokenIds, setGalleryTokenIds, fullTokenIds, setFullTokenIds }  = useFilterGallery()
  
  useEffect(async() => {
    await fetchNFTs()

    
    
    
    setTimeout(() => {
      setLoading(false)
    }, 1000);

    await fetchFullNFTs()
  }, []);

  const fetchNFTs = async() => {
    try {
      const tokenIds = await fetchGalleryTokenIds();
      setNFTs(tokenIds)
      setGalleryTokenIds(tokenIds)
    
    } catch (error) {
      setNFTs([])
      setGalleryTokenIds([])
    }

  }

  const fetchFullNFTs = async() => {
    try {
      const tokenIds = await fetchFullTokenIds(saveFile);
      setFullTokenIds(tokenIds)
    
    } catch (error) {
      setFullTokenIds([])
    }

  }

  return (
    <React.Fragment>
          {loading?
              //render skeleton when loading
            (Array(4)
            .fill()
            .map((item, index) => {
                return(
                    <ProductSkeleton key={index} />
                )
              })):
              //render nfts when finished loading
            (galleryTokenIds &&
              galleryTokenIds.map((nft, index) => {
                return (
                    <ProductCardsLayoutLive  index={index} artist={nft.artistName} artistPhoto = {nft.artistPhoto}
                    collection={nft.name} image={nft.image} name={nft.name} coverArt={nft.coverArt}
                    description={nft.description} nft={nft}
                    mintAddress={nft.mintAddress} 
                     owner={nft.owner} ownerName={nft.ownerName} ownerPhoto={nft.ownerPhoto}
                    fileType={nft.fileType} nftFrom="Artist"/>
            
                )}
              ))
          }
    </React.Fragment>
  );
}

export default GalleryTokenIds