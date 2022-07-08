import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../components/nftyfunctions/LazyFactoryAction";


export const BuyNFT = async(nft, marketAddress, marketContractABI) => {
        
    const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
    const contractABIJson = JSON.parse(marketContractABI);
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const price = ethers.utils.parseUnits(nft.price, 'ether')

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    console.log(price)
    
    let transaction = await marketplaceContract.resellToken(nft.tokenId, {value: price})
    await transaction.wait()
    console.log('success for sure')

  }

export default BuyNFT;