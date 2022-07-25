import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import ProductCardsLayout from "components/nftylayouts/ProductCardsLayout";
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
    try {
    const tokenIds = await fetchTokenIds( marketAddress, marketContractABI, storageAddress, storageContractABI );
    setNFTs(tokenIds)
    fetchArtistPhoto();
    
    } catch (error) {
      setNFTs([])
    }
    
    
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, []);

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
              })):
              //render nfts when finished loading
            (nfts &&
              nfts.map((nft, index) => {
                return (
                    <ProductCardsLayoutLazy key={index} pageFrom="Explore" owner={nft.owner} ownerName={nft.ownerName} owner={nft.ownerPhoto} 
                    artistName={nft.artistName} artist={nft.artist} artistPhoto={nft.artistPhoto} lazy={nft.lazy} voucher={nft.voucher} 
                    gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} description={nft.description} 
                    price={nft.price} coverPhotoURL={nft.coverPhotoURL} nftyLazyFactoryAddress={nftyLazyFactoryAddress} 
                    marketAddress={marketAddress} marketContractABIJson={contractABIJson}

                    />
                )}
              ))
          }
    </React.Fragment>
  );
}

export default NFTTokenIds