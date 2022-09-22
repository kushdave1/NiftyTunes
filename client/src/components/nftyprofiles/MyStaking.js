import React, { useState, useEffect } from "react"
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Moralis from 'moralis'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import ProductCardsStakingLayout from "components/nftylayouts/ProductCardsStakingLayout";
import ProductCardsLayoutLazy from "components/nftylayouts/ProductCardsLayoutLazy";
import ProductSkeleton from "components/nftyloader/ProductSkeleton";
import { useNFTBalance } from "hooks/useNFTBalance";
import { useIPFS } from "hooks/useIPFS";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'


function MyStaking() {
  const {isAuthenticated, user} = useMoralis();
  const [nfts, setNFTs] = useState([]);
  const [stakedNfts, setStakedNFTs] = useState([]);
  const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, stakingAddress, stakingContractABI, collectionAddress, collectionContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const storageContractABIJson = JSON.parse(storageContractABI);
  const stakingContractABIJson = JSON.parse(stakingContractABI);
  const collectionContractABIJson = JSON.parse(collectionContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(true);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { getNFTBalances, dataMoralis, error, isLoading, isFetching } = useNFTBalances();
  const { resolveLink } = useIPFS();
  
  

  useEffect(() => {
    getBonNFT()
    getStakedBonNFT()
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
    if(url.startsWith("ipfs")){
      return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
    }
    else {
      return url+"?format=json"
    }
  };



  // const getNFT = async() => {
  //   const web3Modal = new Web3Modal({})
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const network = await provider.getNetwork(); 
  //   const name = network.name;
  //   const signer = provider.getSigner()
  //   console.log(name)
  //   const signerAddress = await signer.getAddress();

  //   const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)


  //   const dataMarkets = await getNFTBalances({ params: { chain: name } })
  //   const results = dataMarkets.result
  //   const items = []
  //   let image = ''
  //   let imageBon = ''
  //   //let meta = ''
  //   for (const i in results) {
  //     const object = results[i];
  //     console.log(object)
  //     if (object?.token_uri) {
  //       let meta = await axios.get(fixURL(object.token_uri))
  //       for (const j in meta.data) {
  //         if ((meta.data[j]).toString().includes('ipfs')) {
  //           image = resolveLink(meta.data[j])
  //         }}
  //       let item = {
  //         name: meta.data['name'],
  //         description: meta.data['description'],
  //         image: image,
  //         owner: object.owner_of
  //       }
  //       items.push(item)
  //     } else {
  //       let tokenId = parseInt(object.token_id)
  //       const tokenURI = await collectionContract.tokenURI(tokenId)
  //       console.log(tokenURI)
  //       let meta = await axios.get(fixURL(tokenURI))
  //       for (const j in meta.data) {
  //         if ((meta.data[j]).toString().includes('ipfs')) {
  //           imageBon = fixImageURL(meta.data[j])
  //         }}
  //       let item = {
  //         name: meta.data['name'],
  //         description: meta.data['description'],
  //         image: imageBon,
  //         owner: object.owner_of
  //       }
  //       items.push(item)
  //     }
  //   }
  // setNFTs(items)
  // console.log(items)
  // }

  const getBonNFT = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork(); 
    const name = network.name;
    const signer = provider.getSigner()
    console.log(name)
    const signerAddress = await signer.getAddress();

    const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)
    console.log(signerAddress)
    const tokenIdsOwned = await collectionContract.walletOfOwner(signerAddress)

    //const dataMarkets = await getNFTBalances({ params: { chain: name } })
    //const results = dataMarkets.result
    const items = []
    let image = ''
    //let meta = ''

    for (const i in tokenIdsOwned) {
      console.log(i)
      const tokenURI = await collectionContract.tokenURI(i)
      let meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
          image = fixImageURL(meta.data[j])
        }
      }
      let item = {
        name: meta.data['name'],
        description: meta.data['description'],
        image: image,
        owner: signerAddress,
        tokenId: i
      }
      items.push(item)
    }
    setNFTs(items)
    console.log(items)
  }

  const getStakedBonNFT = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork(); 
    const name = network.name;
    const signer = provider.getSigner()
    console.log(name)
    const signerAddress = await signer.getAddress();

    const stakingContract = new ethers.Contract(stakingAddress, stakingContractABIJson, signer)
    const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)
    console.log(signerAddress)
    const tokenIdsOwned = await stakingContract.tokensOfOwner(signerAddress)
    console.log(tokenIdsOwned)

    //const dataMarkets = await getNFTBalances({ params: { chain: name } })
    //const results = dataMarkets.result
    const items = []
    let image = ''
    //let meta = ''

    for (const i in tokenIdsOwned) {
      console.log(i)
      const tokenURI = await collectionContract.tokenURI(i)
      let meta = await axios.get(fixURL(tokenURI))
      for (const j in meta.data) {
        if ((meta.data[j]).toString().includes('ipfs')) {
          image = fixImageURL(meta.data[j])
        }
      }
      let item = {
        name: meta.data['name'],
        description: meta.data['description'],
        image: image,
        owner: signerAddress,
        tokenId: i
      }
      items.push(item)
    }
    setStakedNFTs(items)
    console.log(items)
  }

  const AddToStake = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork(); 
    const name = network.name;
    const signer = provider.getSigner()
    console.log(name)
    const signerAddress = await signer.getAddress();

    const stakingContract = new ethers.Contract(stakingAddress, stakingContractABIJson, signer)
    const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)
    console.log(signerAddress)

    const query = new Moralis.Query('StakedNFTs')
    query.equalTo('ownerAddress', signerAddress)
    const object = await query.first()

    const tokenIds = object.get('tokenIds')
    console.log(tokenIds)

    let approveTransaction = await collectionContract.setApprovalForAll(stakingAddress, true)
    approveTransaction.wait()
    

    let transaction = await stakingContract.stake(tokenIds)
    transaction.wait()

    
  }

  const RemoveFromStake = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork(); 
    const name = network.name;
    const signer = provider.getSigner()
    console.log(name)
    const signerAddress = await signer.getAddress();

    const stakingContract = new ethers.Contract(stakingAddress, stakingContractABIJson, signer)
    const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)
    console.log(signerAddress)

    const query = new Moralis.Query('StakedNFTs')
    query.equalTo('ownerAddress', signerAddress)
    const object = await query.first()

    const tokenIds = object.get('tokenIds')
    console.log(tokenIds)
    

    let transaction = await stakingContract.stake(tokenIds)
    transaction.wait()

    
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
            (stakedNfts &&
              stakedNfts.map((nft, index) => {
                return (
                  <ProductCardsStakingLayout key={index} lazy={nft.lazy} voucher={nft.voucher} tokenId={nft.tokenId} nft={nft} image={nft.image} name={nft.name} description={nft.description} price={nft.price}/>
                );
                }
              ))
          }
          <Container>
            <button onClick={() => RemoveFromStake()}>Unstake Selected and Collect Rewards</button>
          </Container>
          <Container>
            <button onClick={() => AddToStake()}>Stake Selected</button>
          </Container>
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
                  <ProductCardsStakingLayout key={index} lazy={nft.lazy} voucher={nft.voucher} tokenId={nft.tokenId} nft={nft} image={nft.image} name={nft.name} description={nft.description} price={nft.price}/>
                );
                }
              ))
          }
    </React.Fragment>
  );
}

export default MyStaking
