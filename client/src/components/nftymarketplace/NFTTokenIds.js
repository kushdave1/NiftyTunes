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
import { fetchTokenIds } from '../nftyFunctions/FetchTokenIds'

function NFTTokenIds() {

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
  
  useEffect(async() => {
    await fetchNFTs()
    
    
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, []);

  const fetchNFTs = async() => {
    try {
      const tokenIds = await fetchTokenIds( marketAddress, marketContractABI, storageAddress, storageContractABI );
      setNFTs(tokenIds)
    
    } catch (error) {
      setNFTs([])
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
            (nfts &&
              nfts.map((nft, index) => {
                return (
                    <ProductCardsLayoutLazy key={index} pageFrom="Explore" nft={nft} nftyLazyFactoryAddress={nftyLazyFactoryAddress} 
                    marketAddress={marketAddress} marketContractABIJson={contractABIJson} tokenAddress={nft.tokenAddress} tokenId={nft.tokenId}/>
            
                )}
              ))
          }
    </React.Fragment>
  );
}

export default NFTTokenIds