import { ethers, utils } from 'ethers';

export const GetProvider = () => {

    const RPC = "https://mainnet.infura.io/v3/aa43136e69e443169eb5eec0d594be7a";
    const provider = new ethers.providers.JsonRpcProvider(RPC);
  
    return provider
  }