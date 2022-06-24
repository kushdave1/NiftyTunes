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

function NFTTokenIds() {

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
    setTimeout(() => {
      setLoading(false)
    }, 1000);
}, []);


  const fetchTokenIds = async() => {
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
        price: object.get("price"), 
        tokenId: object.get("tokenId"),
        owner: object.get("signerAddress"),
        gallery: object.get("galleryAddress"),
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI: object.get("tokenURI"),
        voucher: object.get("voucher"),
        lazy: true,
        isSold: object.get("isSold")
      }
      if (item.isSold === false) {
        items.push(item);
      }
    }

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)

    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)

    const dataStorage = await storageContract.fetchMarketItems()

    await Promise.all(dataStorage.map(async i => {
      console.log(i.tokenId.toString())
      if (i.tokenId.toString() === '0') {
        return;
      }
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
            imageLink = meta.data[j]
            image = resolveLink(meta.data[j])
        }
      }
      
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        seller: i.seller,
        image: imageLink,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI,
        lazy: false
      }
      items.push(item)
    }))


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
                console.log(nft.lazy)
                if (nft.lazy) {
                return (
                    <ProductCardsLayoutLazy key={index} lazy={nft.lazy} voucher={nft.voucher} gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} owner={nft.owner} description={nft.description} price={nft.price}/>
                );
                } else {
                return (
                  <ProductCardsLayout key={index} lazy={nft.lazy} voucher={nft.voucher} gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} owner={nft.owner} description={nft.description} price={nft.price}/>
                );
                }
              }))
          }
    </React.Fragment>
  );
}

export default NFTTokenIds