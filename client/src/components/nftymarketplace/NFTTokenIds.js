import React, { useState, useEffect } from "react"
import { useMoralis} from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import ProductCardsLayout from "components/nftylayouts/ProductCardsLayout";
import ProductSkeleton from "components/nftyloader/ProductSkeleton";

function NFTTokenIds() {
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetchTokenIds()
    setTimeout(() => {
      setLoading(false)
    }, 4000);
}, []);

  
  const fixURL = (url) => {
    if(url.startsWith("ipfs")){
      return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
    }
    else {
      return url+"?format=json"
    }
  };
  const fixImageURL = (url) => {
    if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
    }
    else {
      return url+"?format=json"
    }
  };

  const fetchTokenIds = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const signerAddress = await signer.getAddress();
    const ItemImage = await Moralis.Object.extend("ItemImages");

    const query = new Moralis.Query(ItemImage);
    const data = await query.find();
    const items = []
    for (const i in data) {
      const object = data[i];
      const meta = await axios.get(fixURL(object.get('tokenURI')))
      let item = {
        price: object.get("price"), 
        tokenId: object.get("tokenId"),
        owner: object.get("signerAddress"),
        image: fixImageURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        tokenURI: object.get("tokenUri")
      }
      items.push(item);
  }
    setNFTs(items);
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
              })):
              //render nfts when finished loading
            (nfts &&
              nfts.map((nft, index) => {
                return (
                    <ProductCardsLayout key={index} image={nft?.image} name={nft.name} description={nft.description}/>
                );
              }))
          }
    </React.Fragment>
  );
}

export default NFTTokenIds