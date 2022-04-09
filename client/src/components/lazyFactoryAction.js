/* eslint-disable no-nested-ternary */
import { ethers, utils } from 'ethers';
// import Voucher from '../components/voucher.js';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import LazyFactory from '../contracts/NFTMarketplace.sol/LazyFactory.json';
// import LazyFactory from '../contracts/LazyFactory.sol/LazyFactory.json';
// import { updateArtwork } from './artworkAction';
// import { updateArtistGallery } from './artistAction';
// import { connectMetaMaskWallet, validateAddress } from '../wallet';

const decimalPlaces = 2;

const SIGNING_DOMAIN_NAME = "NFTY";
const SIGNING_DOMAIN_VERSION = "1";


class Voucher {
  constructor({ contract, signer }) {
    this.contract = contract;
    this.signer = signer;
  }

  // design your domain separator
  async designDomain() {
    if (this.domainData != null) {
      return this.domainData;
    }

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)


    const { chainId } = await provider.getNetwork();
    
    this.domainData = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    };
    return this.domainData;
  }

  async signTransaction(
    tokenId,
    artwork,
    totalInWei,
    tokenUri,
    royalty
  ) {
    const domain = await this.designDomain();
    // define your data types
    const types = {
      Voucher: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'title', type: 'string' },
        { name: 'priceWei', type: 'uint256' },
        { name: 'tokenUri', type: 'string' },
        { name: 'royalty', type: 'uint256' }
      ],
    };
    console.log(artwork);
    const voucher = {
      tokenId,
      title: artwork,
      priceWei: totalInWei,
      tokenUri,
      royalty,
      content: `Hey, You are signing this work to be available for sale!`
    };

    // signer._signTypedData(domain, types, value) =>  returns a raw signature
    const signature = await this.signer._signTypedData(domain, types, voucher);

    return {
      ...voucher,
      signature,
    };
  }
}

// to use in our state / js file for wallet is the alternative --> connectMetaMaskWallet()
export const connectWallet = async() => {
  try {
    window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
  } catch (e) {
    console.log('problem wallet connection: ');
  }
};

export const deployMyGallery = async(marketPlaceAddress, galleryName, artistId) => {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const signerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        signer
      );
      const artistWalletAddress = await signer.getAddress();
      const signerContract = await signerFactory.deploy(
        marketPlaceAddress,
        'NFTY',
        galleryName,
        artistWalletAddress
      );
      await signerContract.deployTransaction.wait(); // loading before confirmed transaction

      const galleryAddress = await signerContract.address;
      return galleryAddress;
      // updateArtistGallery(galleryAddress, artistId, artistWalletAddress);
  
};

// Sign an item in voucher form that becomes an off-chain ticket for a buyer to purchase for an NFT

export const signMyItem = async(artistGalleryAddress, artwork, artworkPriceEth, tokenURI, royalty) => {
    


    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    console.log(signerAddress, 'hi')
    let voucher;
    // try {
        // connect wallet



        // make sure the address is the artist's address who is uploading the work
      // await validateAddress(signerAddress, artwork.artist.wallet_address);
      //   // create a contract factory -- look up specs for ContractFactory
    const signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );
    //     // apparently you can attach an address to a contract -- look into this
    console.log(artistGalleryAddress);
    const signerContract = signerFactory.attach(artistGalleryAddress);

    //     // create the voucher using the Voucher class which is imported and in a separate file
    const theSignature = new Voucher({ contract: signerContract, signer });


    const totalInWei = ethers.utils.parseUnits(
      (parseFloat(artworkPriceEth)).toString(),
      'ether',
      decimalPlaces
    );

    //     // look into how an 'artwork' struct is structured, make modifications for a nftytunes piece
    //     // signTransaction comes from voucher
    console.log(signerAddress)
    const ItemImage = Moralis.Object.extend("ItemImages");
    const itemImage = new ItemImage();
    itemImage.set("galleryAddress", artistGalleryAddress);
    itemImage.set("signerAddress", signerAddress);
    itemImage.set("name", artwork);
    itemImage.set("price", artworkPriceEth);
    itemImage.set("tokenURI", tokenURI);
    itemImage.set("royalty", royalty);

    const query = new Moralis.Query(ItemImage);
    const results = await query.find();

    itemImage.set("tokenId", results.length);

    voucher = await theSignature.signTransaction(
        results.length,
        artwork,
        totalInWei,
        tokenURI,
        royalty
      );

    
    itemImage.set("voucher", voucher);

    itemImage.save();
  };


  

export const mintAndRedeem = async(artistGalleryAddress, voucher, feeEth) => {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const { chainId } = await provider.getNetwork();
      const redeemer = provider.getSigner()

      const domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: artistGalleryAddress,
      chainId,
      };

      // define your data types
      const types = {
        Voucher: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'title', type: 'string' },
          { name: 'priceWei', type: 'uint256' },
          { name: 'tokenUri', type: 'string' },
          { name: 'royalty', type: 'uint256' }
        ],
      };

      const recoveredAddress = ethers.utils.verifyTypedData(domain, types, voucher, voucher.signature);
      console.log(recoveredAddress);


      // Returns a new instance of the ContractFactory with the same interface and bytecode, but with a different signer.
      const redeemerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        redeemer
      );

      // Return an instance of a Contract attached to address. This is the same as using the Contract constructor
      // with address and this the interface and signerOrProvider passed in when creating the ContractFactory.
      const redeemerContract = redeemerFactory.attach(artistGalleryAddress);
      const redeemerAddress = await redeemer.getAddress();

      console.log(redeemerAddress);

      const theVoucher = {
        artworkId: parseInt(voucher.tokenId),
        title: voucher.title,
        priceWei: voucher.priceWei,
        tokenUri: voucher.tokenUri,
        royalty: voucher.royalty,
        content: voucher.content,
        signature: voucher.signature
      };
      console.log(theVoucher)
      const feeWei = ethers.utils.parseUnits(
        parseFloat(feeEth).toFixed(5).toString(),
        'ether'
      );
    // execute smart contract redeem function to buy nft and transfer fee to marketplace contract, can withdrawe using withdraw function on marketplace contract
      const redeemTx = await redeemerContract.redeem(
        redeemerAddress,
        theVoucher,
        recoveredAddress,
        {
          value: voucher.priceWei,
        }
      );
      const transactionData = await redeemTx.wait();
      console.log(transactionData);

      const eventTokenId = parseInt(transactionData.events[2]);
      console.log(eventTokenId);
      const { transactionHash } = transactionData;

          // look this up from artworkAction.js on how its structured, change for nfty
  };