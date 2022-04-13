import React, { useState, useEffect } from "react"
import { useMoralis} from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import NFTPlayer from "components/nftymix/NFTPlayer"
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ProductCardsLayout from "components/nftylayouts/ProductCardsLayout";


function NFTTokenIds() {
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    if(!user) return null
    fetchTokenIds();
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
    console.log(signerAddress)
    const ItemImage = await Moralis.Object.extend("ItemImages");

    const query = new Moralis.Query(ItemImage);
    const data = await query.find();
    const items = []
    for (let i = 0; i < data.length; i++) {
      const object = data[i];
      const meta = await axios.get(fixURL(object.get('tokenURI')))
      console.log(meta);
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
    setLoading(true) 
}

  console.log()

  return (
      <div>
          {nfts &&
            nfts.map((nft, index) => {
              return (
                <Col>
                  <ProductCardsLayout image={nft?.image} name={nft.name} description={nft.description}/>
                </Col>
              );
            })}
      </div>
  );
}

export default NFTTokenIds