import React, { useEffect } from 'react'

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'

//custom
import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
//import BuyNFT from "../nftymarketplace/BuyNFT"
//import { BidNFT } from "../nftymarketplace/BidNFT"
import { useState } from "react"

const decimalPlaces = 5;


 
function ProductCardsLayout({image, name, description, tokenId, nft}) {

  const initialList = []

  const [offerPrice, setOfferPrice] = useState(1);
  const [staked, setStaked] = useState('Stake NFT');
  const [stakedNFTs, setStakedNFTs] = useState(initialList);
  const { chainId, collectionAddress, collectionContractABI, stakingAddress, stakingContractABI } = useMoralisDapp();

  useEffect(() => {
    queryNFTs()
  }, []);

  const queryNFTs = async() => {
    const query = new Moralis.Query('StakedNFTs')
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork(); 
    const name = network.name;
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress();
    query.equalTo('ownerAddress', signerAddress)
    const object = await query.first()
    if (object.tokenIds.includes(tokenId)) {
      setStaked('Remove Staked NFT')
    } else {
    setStaked('Add to Stake')
    }
  }

  
  const stakeNFT = async(tokenId, isStaked) => {
    
    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork(); 
    const name = network.name;
    const signer = provider.getSigner()
    console.log(name)
    const signerAddress = await signer.getAddress();
    console.log(isStaked)

    if (isStaked['staked'] === 'Stake NFT') {

      const query = new Moralis.Query('StakedNFTs')
      query.equalTo('ownerAddress', signerAddress)
      const object = await query.first()

      if (object) {
        object.addUnique("tokenIds", parseInt(tokenId['tokenId']))
        object.save()
      } else {
      const NFTStaked = Moralis.Object.extend("StakedNFTs");
      const nftStaked = new NFTStaked();
      nftStaked.set("tokenIds", [parseInt(tokenId['tokenId'])]);
      nftStaked.set("ownerAddress", signerAddress);
      nftStaked.save()
      }
      setStaked('Remove Staked NFT')

    } else {

      const query = new Moralis.Query('StakedNFTs')
      query.equalTo('ownerAddress', signerAddress)
      const object = await query.first()

      console.log(object)

      object.remove('tokenIds', parseInt(tokenId['tokenId']))

      object.save()
      setStaked('Stake NFT')

    }
    
  }

  return (
    <Col xs={1} md={4}>
      <Card className="bg-dark shadow-sm p-2" style={{ width: '20rem', height: '30rem', borderRadius:'.25rem'}} >
            { (image.toString().includes('png')===true) ? (<NFTImage output={image}/>) : (<NFTPlayer output={image}/>) }
          <Card.Body>
            <Row>
                  <Col>
                    <></>
                  </Col>
                  <Col md={6}> 
                      <Card.Title className="text-light">{name}</Card.Title>
                      <Card.Text className="text-light">{description}</Card.Text>
                      <div>
                        <button onClick={() => stakeNFT({tokenId}, {staked})}>{staked}</button>
                      </div>
                  </Col>
              </Row>
          </Card.Body>
      </Card>
    </Col>
  )
}

export default ProductCardsLayout