import React, {useEffect, useState} from 'react'

//custom components
import NFTPlayer from './NFTPlayer'
import AddMetadata from './AddMetadata'

//bootstrap components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

//Moralis
import {useMoralis, useMoralisFile} from 'react-moralis'
import Moralis from 'moralis'
import { useNFTBalance } from "../../hooks/useNFTBalance";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";

//Ethers
import { ethers } from 'ethers'
import { TypedDataUtils } from 'ethers-eip712'

//web3modal
import Web3Modal from 'web3modal'


function NFTMinter({formData, setFormData}) {

  useEffect(() => {
    console.log(formData.outputFile);
  }, []);

  const {saveFile} = useMoralisFile();
  const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
  const contractABIJson = JSON.parse(marketContractABI);

  const mintNFT = async () => {
    if(!(formData.nftName) || !(formData.nftDesc)){
        //setMintErrMessage('Please enter a name and description to mint.');
    }
    else if(isNaN(parseInt(formData.nftRoyalty)) || parseInt(formData.nftRoyalty) % 1 != 0){
        //setMintErrMessage('Royalty amount must be an integer.')
    }
    const nftFile = new Moralis.File("newnft.mp4", Array.from(await formData.outputFile));
    const fileIPFS = await nftFile.saveIPFS();

    if(fileIPFS){
        let fileHash = fileIPFS._hash

        console.log(fileIPFS._hash);
        console.log(fileIPFS._ipfs);
    
        //Create metadata with video hash & data
        const metadata = {
            name: formData.nftName,
            description: formData.nftDesc,
            image: '/ipfs/' + fileHash
        };

        //save metadata file and upload to rarible
        const metadataFileIPFS = await saveFile('metadata.json', {
            base64: btoa(JSON.stringify(metadata))
        }, {
            saveIPFS:true, 
            onSuccess: async (metadataFile) => {
                //props.setMintProgress(60)
                //props.setMintProgressLabel('Awaiting Signature')
                await Moralis.enableWeb3();
                const tokenURI = ('ipfs://' + metadataFile._hash);
                const listNFT = await listNFTForSale(tokenURI, formData.nftListPrice, formData.nftRoyalty);
                    //props.setMintProgress(100)
                    //props.setMintProgressLabel('Done!')
                    //setMintSuccessMsg(`Congrats, you have minted and listed your NFT for sale! `)
                    //props.setMintProgress(null)
                    //props.setMintProgressLabel(null)
                    console.log('mint & list success')
            }
        }); 
    }

  }

  async function listNFTForSale(url, listPrice, royalty) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(listPrice, 'ether')
    const royaltyFee = (royalty).toString()
    const royaltyFeeFinal = ethers.utils.parseUnits(royaltyFee, 'wei')
    console.log("Price" + price, "royalty" + royaltyFeeFinal);
    let contract = new ethers.Contract(marketAddress, contractABIJson, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, royaltyFeeFinal, { value: listingPrice })
    await transaction.wait()
    console.log('list success')
}

  const handleMint = (e) => {
        e.preventDefault();
        mintNFT();
  }
  return (
    <Container>
        <Row>
            <Col>
                <NFTPlayer output={formData.playerSrc} />
            </Col>
            <Col>
                <Row>
                    <AddMetadata formData={formData} setFormData={setFormData} />
                </Row>
                <Row>
                    <Button variant="primary" className = 'w-75' onClick={handleMint}>
                                    Let's mint!
                    </Button>
                </Row>
            </Col>
        </Row>
    </Container>
  )
}

export default NFTMinter