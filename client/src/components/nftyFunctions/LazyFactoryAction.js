/* eslint-disable no-nested-ternary */
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import LazyFactory from '../../contracts/NFTMarketplace.sol/LazyFactory.json';
import NftyLazyFactory from '../../contracts/NFTMarketplace.sol/NftyLazyFactory.json';
import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'

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

export const deployMyGallery = async(marketPlaceAddress, galleryName, gallerySymbol) => {
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
        galleryName,
        'NFTY',
        artistWalletAddress
      );
      await signerContract.deployTransaction.wait(); // loading before confirmed transaction

      const galleryAddress = await signerContract.address;

      const Collections = Moralis.Object.extend("Collections")
      const Collection = new Collections()

      Collection.set("collectionAddress", galleryAddress)
      Collection.set("collectionName", galleryName)
      Collection.set("collectionSymbol", gallerySymbol)
      Collection.set("signerAddress", artistWalletAddress)

      return galleryAddress;
  
};

// Sign an item in voucher form that becomes an off-chain ticket for a buyer to purchase for an NFT

export const signMyItem = async(artistGalleryAddress, artwork, artworkPriceEth, tokenURI, royalty, coverFile, saveFile, isCollection) => {
    


    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    let voucher;


    //const outputFile = URL.createObjectURL(coverFile, {type: 'image/png'});

    //console.log(outputFile)

    // try {
        // connect wallet



        // make sure the address is the artist's address who is uploading the work
      // await validateAddress(signerAddress, artwork.artist.wallet_address);
      //   // create a contract factory -- look up specs for ContractFactory

    let signerFactory = ""

    if (isCollection) {
      signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );
      //     // apparently you can attach an address to a contract -- look into this
     

    } else {
      signerFactory = new ethers.ContractFactory(
      NftyLazyFactory.abi,
      NftyLazyFactory.bytecode,
      signer
    );
     
    }

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
    const ListedNFTs = Moralis.Object.extend("ListedNFTs");
    const listedNFT = new ListedNFTs();
    listedNFT.set("galleryAddress", artistGalleryAddress);
    listedNFT.set("signerAddress", signerAddress);
    listedNFT.set("name", artwork);
    listedNFT.set("price", artworkPriceEth);
    listedNFT.set("tokenURI", tokenURI);
    listedNFT.set("royalty", royalty);
    listedNFT.set("isSold", false);
    listedNFT.set("ownerName", `${signerAddress}${artwork}`)
    listedNFT.set("buyerAddress", []);
    listedNFT.set("pricePurchased", []);

    await saveFile("photo.jpg", coverFile, {
            type: "image",
            onSuccess: (result) => {listedNFT.set('coverPhoto', result); listedNFT.set('coverPhotoURL', result.url());console.log("success")},
            onError: (error) => console.log(error),
        });

    const query = new Moralis.Query('ListedNFTs');
    const results = await query.find();

    listedNFT.set("artworkId", results.length+1);

    voucher = await theSignature.signTransaction(
        results.length+1,
        artwork,
        totalInWei,
        tokenURI,
        royalty
      );

    
    listedNFT.set("voucher", voucher);

    listedNFT.save();
  };


  

export const mintAndRedeem = async(artistGalleryAddress, voucher, feeEth, nftyLazyFactoryAddress) => {
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

      let abi = ""
      let bytecode = ""

      if (artistGalleryAddress == nftyLazyFactoryAddress) {

        abi = NftyLazyFactory.abi
        bytecode = NftyLazyFactory.bytecode

      } else {
        abi = LazyFactory.abi
        bytecode = LazyFactory.bytecode

     
    }
      // Returns a new instance of the ContractFactory with the same interface and bytecode, but with a different signer.
      const redeemerFactory = new ethers.ContractFactory(
        abi,
        bytecode,
        redeemer
      );

      // Return an instance of a Contract attached to address. This is the same as using the Contract constructor
      // with address and this the interface and signerOrProvider passed in when creating the ContractFactory.
      const redeemerContract = redeemerFactory.attach(artistGalleryAddress);
      const redeemerAddress = await redeemer.getAddress();

      const theVoucher = {
        artworkId: parseInt(voucher.tokenId),
        title: voucher.title,
        priceWei: voucher.priceWei,
        tokenUri: voucher.tokenUri,
        royalty: voucher.royalty,
        content: voucher.content,
        signature: voucher.signature
      };

      const feeWei = ethers.utils.parseUnits(
        parseFloat(feeEth).toFixed(5).toString(),
        'ether'
      );
      console.log(redeemerAddress,
        theVoucher,
        recoveredAddress)
    // execute smart contract redeem function to buy nft and transfer fee to marketplace contract, can withdrawe using withdraw function on marketplace contract
      console.log(redeemerContract)
      const redeemTx = await redeemerContract.redeem(
        redeemerAddress,
        theVoucher,
        recoveredAddress,
        {
          value: voucher.priceWei
        }
      );
      const transactionData = await redeemTx.wait();

      const eventTokenId = parseInt(transactionData.events[2]);
      console.log(eventTokenId);
      const { transactionHash } = transactionData;

      const query = new Moralis.Query('ListedNFTs')

      query.equalTo('tokenURI', voucher.tokenUri)
      const object = await query.first() // just get 1 item, not array of items

      object.set("isSold", true)
      object.addUnique("buyerAddress", redeemerAddress)
      object.addUnique("pricePurchased", voucher.priceWei)

      object.save()

          // look this up from artworkAction.js on how its structured, change for nfty
  };