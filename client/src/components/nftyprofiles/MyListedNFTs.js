import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis"
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Moralis from 'moralis'
import $ from "jquery"
import { useNFTBalance } from "../../hooks/useNFTBalance";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';

const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};


function MyListedNFTs() {
  const {isAuthenticated, user} = useMoralis();
  const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
  const [address, setAddress] = useState();
  const [nftData, setNftData] = useState();
  const [nfts, setNFTs] = useState([]);
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
  const [visible, setVisibility] = useState(false);
  const contractABIJson = JSON.parse(marketContractABI);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ItemImages");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function list(nft, listPrice) {
    console.log(nft.token_id);
    setLoading(true);
    const p = listPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        tokenId: nft.token_id,
        price: String(p),
      },
    };
    console.log(ops);
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        addItemImage();
        succList();
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        failList();
      },
    });
  }

  async function approveAll(nft) {
    setLoading(true);  
    console.log(nft);
    const ops = {
      contractAddress: nft.token_address,
      functionName: "setApprovalForAll",
      abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      params: {
        operator: marketAddress,
        approved: true
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        setVisibility(false);
      },
      onError: (error) => {
        console.log(error)
        setLoading(false);
      },
    });
  }
  
  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };


  // const { fetchERC20Balances, data, error, isLoading, isFetching } = useERC20Balances();

  useEffect(() => {
        if(!user) return null
        setAddress(user.get('ethAddress'))
    }, [user]);
  
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


  const NFTBalancesListed = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)

    const data = await marketplaceContract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

      const meta = await axios.get(fixURL(tokenURI))
      console.log(meta)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: fixImageURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        tokenURI
      }
      return item
    }))
    setNFTs(items)
    console.log(items);
    setLoading(true) 
  }
  
  const LazyBalancesListed = async() => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const signerAddress = await signer.getAddress();
    console.log(signerAddress)
    const ItemImage = await Moralis.Object.extend("ItemImages");

    const query = new Moralis.Query(ItemImage);

    query.equalTo("signerAddress", signerAddress);
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


  const deListNFT = async(nft) => {
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
    let listingPrice = await marketplaceContract.getListingPrice()
    console.log(nft)
    let transaction = await marketplaceContract.delistToken(nft.tokenId)
    await transaction.wait()
    console.log('success for sure')

  }





  function succList() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT was listed on the marketplace`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approval is now set, you may list your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToSend.image);
    itemImage.set("nftContract", nftToSend.token_address);
    itemImage.set("tokenId", nftToSend.token_id);
    itemImage.set("name", nftToSend.name);

    itemImage.save();
  }
    





  return (
    
    <Container>
      <Row xs={1} md={4} className="g-4 d-flex justify-content-center">
        <div>
          <button onClick={() => LazyBalancesListed()}>Fetch NFTs you own that are listed</button>
        </div>
      </Row>
      <Row>
        {nfts && nfts.slice(0,5).map((nft, index) => (
        <Col>
          <Card className="shadow-sm animate__animated animate__fadeInUp" style={{ width: '20rem', height: '25rem', borderRadius:'1rem' }} >
            <Card.Body key="parent">
              <h2 key="{nft.name}" className="fw-bold mb-0">{nft.name}</h2>
              <br></br>
              <video key="{nft.image}" style={{ width: '15rem', height: '15rem', borderRadius:'1rem' }} src={nft.image} loop={true}
                                            autoPlay
                                            muted controls crossOrigin="true"></video>
              <div key="{nft.description}">{nft.description}</div>

              <div>
                <button onClick={() => {handleShow(); handleSellClick(nft)}}>Delist this NFT</button>
              </div>
            </Card.Body>
          </Card>
          <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <div>
              {/* <button onClick={() => approveAll(nftToSend)}>Approve</button> */}
              <button onClick={() => deListNFT(nftToSend)}>DeList</button>
            </div>
          </Modal>
        </Col>
        )
        )} 
      </Row>
      
      
    </Container>
    
  );
}

export default MyListedNFTs;
