import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"


export const BidNFT = async(nft, bidPrice) => {
    const { marketAddress, marketContractABI } = useMoralisDapp();
    
    const contractABIJson = JSON.parse(marketContractABI);
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const price = ethers.utils.parseUnits(bidPrice, 'ether')

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    console.log(nft)
    
    let transaction = await marketplaceContract.placeBid(nft.tokenId, {value: price})
    console.log('success for sure')

  }
