import React, { useState } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

//Explore components
import NFTTokenIds from '../nftymarketplace/NFTTokenIds'

//Layouts
import ProductListLayout from '../nftylayouts/ProductListLayout'
import ProductCardsLayout from '../nftylayouts/ProductCardsLayout'
import FilterLayout from '../nftylayouts/FilterLayout'

//Bootstrap
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import nftyimg from "../../assets/images/NT_White_Isotype.png";

//Moralis
import { useMoralis, useMoralisFile } from 'react-moralis'
import Moralis from 'moralis'

//Contract ABIs and ByteCodes
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import LiveMintFactory from '../../contracts/LiveMint.sol/LiveMintFactory.json';



const MarketPlaceSection = styled.div `
    padding: 50px;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
`;

const SearchAndFilterSection = styled.div``;
const TrendingSection = styled.div``;

function LiveMint() {
    const {isAuthenticated, user} = useMoralis();
    const { saveFile } = useMoralisFile();
    const [show, setShow] = useState(false);
    const [stream, setStream] = useState("")
    const [mintNumber, setMintNumber] = useState("")
    const [royalty, setRoyalty] = useState()
    const [coverArt, setCoverArt] = useState("")
    let navigate = useNavigate()
    
    const [bannerImage, setBannerImage] = useState("")
    const [galleryName, setGalleryName] = useState("")
    const [gallerySymbol, setGallerySymbol] = useState("")
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const DeployLiveContracts = async() => {
        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        const liveMintFactoryContract = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
        const liveAuctionFactoryContract = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)


        const liveMintContract = await liveMintFactoryContract.deploy(
            galleryName,
            gallerySymbol,
            signerAddress,
            mintNumber,
            royalty
        );

        await liveMintContract.deployTransaction.wait(); // loading before confirmed transaction
        const liveMintAddress = await liveMintContract.address
        const liveAuctionContract = await liveAuctionFactoryContract.deploy(
            liveMintAddress
        );

        await liveAuctionContract.deployTransaction.wait(); 

        const liveAuctionAddress = await liveAuctionContract.address

        await SubmitLiveMintData(liveMintAddress, liveAuctionAddress, {
            onSuccess: () => navigate(`live/${liveMintAddress}/${galleryName}`)
        })
        
        

    }

    const SubmitLiveMintData = async(liveMintAddress, liveAuctionAddress) => {
        const LiveMintedCollection = Moralis.Object.extend("LiveMintedCollections")
        const liveMint = new LiveMintedCollection()

        

        liveMint.set("StreamLink", stream);
        liveMint.set("MintNumber", mintNumber);
        liveMint.set("CollectionName", galleryName);
        liveMint.set("CollectionSymbol", gallerySymbol);
        liveMint.set("royalty", royalty);

        liveMint.set("liveMintAddress", liveMintAddress);
        liveMint.set("liveAuctionAddress", liveAuctionAddress);

        await saveFile("photo.jpg", coverArt, {
            type: "image",
            onSuccess: (result) => {liveMint.set('coverArt', result); liveMint.set('CoverArtURL', result.url());console.log(result)},
            onError: (error) => console.log(error),
        });

        await saveFile("photo.jpg", bannerImage, {
            type: "image",
            onSuccess: (result) => {liveMint.set('bannerImage', result); liveMint.set('bannerImageURL', result.url());console.log(result)},
            onError: (error) => console.log(error),
        });



        await liveMint.save({
                onSuccess: console.log("success")
            })
        
    }

    

    return (
    <>
      <MarketPlaceSection>
        <Container fluid className="p-3" style={{fontSize: 24, fontWeight: "bold"}}>
           <Row>
                <Col sm={10}>
                    NftyTunes Live: Putting Real Experiences On-Chain
                </Col>
                <Col sm={2}>
                    <Button variant="dark" style={{borderRadius: "5rem", float: "right"}} onClick={()=>handleShow()}>
                        + Create a Live Collection
                    </Button>
                </Col>
           </Row>
        </Container>
        {/* <Container fluid className="p-0" style={{backgroundColor: "white"}}>
            <hr></hr>
            <Row className="p-2">
                <Col sm={2} style={{paddingRight: "20px"}}>
                    <FilterLayout></FilterLayout>
                </Col>

                <Col sm={10} style={{ paddingLeft: "20px"}}>
                    
                    <ProductListLayout>
                        <NFTTokenIds/>
                    </ProductListLayout>    
                    
                </Col>
            </Row>
        </Container> */}
      </MarketPlaceSection>
        <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Enter Details for your Live Mint!
            </Modal.Title>
            <Form style={{padding: "30px"}}>
                <Form.Group className="mb-3" controlId="nft.galleryName">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Collection Name"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Collection Name'
                        onChange={e => setGalleryName(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.gallerySymbol">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Collection Symbol"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Collection Symbol'
                        onChange={e => setGallerySymbol(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.stream">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Stream Link"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Enter Live Stream Link'
                        onChange={e => setStream(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.royalty">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Royalty %"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Enter Royalty %'
                        onChange={e => setRoyalty(e.target.value*100)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.mintNumber">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Number of NFTs to mint"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= '# of NFTs to Mint'
                        onChange={e => setMintNumber(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <div className='d-flex justify-content-center m-1'>
                    <small className='text-dark'>Cover Art (Shown before NFT Metadata is Inserted)</small>
                </div>
                <div className='d-flex justify-content-center p-2'>
                    <Form.Group controlId = "uploadPhotoFile" style={{width: 275}}>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload Cover Art" 
                            onChange={(e) => setCoverArt(e.target.files?.item(0))}
                        />
                    </Form.Group>

                </div>
                <div className='d-flex justify-content-center m-1'>
                    <small className='text-dark'>Banner Image</small>
                </div>
                <div className='d-flex justify-content-center p-2'>
                    <Form.Group controlId = "uploadPhotoFile" style={{width: 275}}>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload Banner Image" 
                            onChange={(e) => setBannerImage(e.target.files?.item(0))}
                        />
                    </Form.Group>

                </div>
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>DeployLiveContracts()}>
                    Generate
                </Button>
            </Form>       
        </Modal>
    </>
    )
}

export default LiveMint
