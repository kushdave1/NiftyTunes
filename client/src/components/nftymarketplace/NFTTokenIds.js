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

function NFTTokenIds() {
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
        gallery: object.get("galleryAddress"),
        image: fixImageURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        tokenURI: object.get("tokenUri"),
        voucher: object.get("voucher"),
        lazy: true
      }
      items.push(item);
    }

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)

    const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)

    const dataStorage = await storageContract.fetchMarketItems()

    await Promise.all(dataStorage.map(async i => {
      console.log(i.tokenId.toString())
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      console.log(meta)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        seller: i.seller,
        image: fixImageURL(meta.data.image),
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