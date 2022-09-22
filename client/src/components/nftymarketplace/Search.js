import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import ProductCardsLayoutLazy from "components/nftylayouts/ProductCardsLayoutLazy";
import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useIPFS } from "hooks/useIPFS";

function Search(props) {

  const { resolveLink } = useIPFS();
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const storageContractABIJson = JSON.parse(storageContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetchTokenIds()
}, []);


  const fetchTokenIds = async() => {
    console.log(props.searchTerm)
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const signerAddress = await signer.getAddress();
    const ItemImage = await Moralis.Object.extend("ListedNFTs");

    const query = new Moralis.Query(ItemImage);
    const data = await query.find();
    const items = []

    let image = ''
    let imageLink = ''

    for (const i in data) {
      const object = data[i];
      const meta = await axios.get(fixURL(object.get("tokenURI")))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
            image = resolveLink(meta.data[j])
        }
      }
      let item = {
        name: meta.data.name
      }
      if (item.isSold === false) {
        items.push(item);
      }
    }

    setNFTs(items);
  }

  return (
    <div>
        {props.searchTerm}
          {/* {
            (nfts &&
              nfts.map((nft, index) => {
                console.log(props.searchTerm)
                }
              ))
          } */}
    </div>
  );
}

export default Search