import React, { useState } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

//Explore components
import LiveCollectionIds from '../nftymarketplace/LiveCollectionIds'

//Layouts
import ProductListLayout from '../nftylayouts/ProductListLayout'
import ProductCardsLayout from '../nftylayouts/ProductCardsLayout'
import FilterLayout from '../nftylayouts/FilterLayout'
import LiveCollectionLayout from '../nftylayouts/LiveCollectionLayout'

//Bootstrap
import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Alert from 'react-bootstrap/Alert'

import nftyimg from "../../assets/images/NT_White_Isotype.png";
import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'

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

    const [mintErrMessage, setMintErrMessage] = useState("")
    const {isAuthenticated, user} = useMoralis();
    const { saveFile } = useMoralisFile();
    const [show, setShow] = useState(false);
    const [showTwo, setShowTwo] = useState(false);
    const [stream, setStream] = useState("")
    const [mintNumber, setMintNumber] = useState("")
    const [royalty, setRoyalty] = useState()
    const [coverArt, setCoverArt] = useState("")
    const [date, setDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [description, setDescription] = useState("")
    const [mintAddress, setMintAddress] = useState("")


    const [showGenerating, setShowGenerating] = useState(false)

    const [loadingLiveMint, setLoadingLiveMint] = useState(true)
    const [liveMintError, setLiveMintError] = useState(false)

    const [loadingLiveAuction, setLoadingLiveAuction] = useState(true)
    const [liveAuctionError, setLiveAuctionError] = useState(false)

    const [loadingSaveDetails, setLoadingSaveDetails] = useState(true)
    const [saveDetailsError, setSaveDetailsError] = useState(false)

    const [auctionDeployed, setAuctionDeployed] = useState(false)
    let navigate = useNavigate()
    
    const [bannerImage, setBannerImage] = useState("")
    const [galleryName, setGalleryName] = useState("")
    const [gallerySymbol, setGallerySymbol] = useState("")

    const handleShow = () => setShow(true)
    const handleClose = () => {
        setShow(false)
        setMintErrMessage("")
    }
    const handleNext = () => {
        if(!galleryName || !gallerySymbol){
            setMintErrMessage('Please enter a name and symbol to mint.');
        }
        else if(isNaN(parseInt(royalty)) || parseInt(royalty) % 1 != 0){
            setMintErrMessage('Royalty amount must be an integer.')
        }
        else if(!stream.includes("https://")){
            setMintErrMessage('Please enter a valid stream link! (must include https://)')
        }
        else if(isNaN(parseInt(mintNumber)) || mintNumber % 1 != 0){
            setMintErrMessage('Mint Number amount must be an integer.')
        }
        else{
            setMintErrMessage('');
            setShow(false)
            handleShowTwo()
        };
    }
    const handleShowTwo = () => setShowTwo(true);
    const handleCloseTwo = () => {
        setShowTwo(false);
        setMintErrMessage("")
    }

    const handleGenerate = () => {
        
        if(!description) {
            setMintErrMessage("Please enter a description.")
        } 
        else if(!date || !startTime || !endTime) {
            setMintErrMessage("Please enter Time Specs for your auction")
        }
        
        else {
            setMintErrMessage("")
            setShowTwo(false);
            handleShowGenerating()
            DeployLiveContracts()
        }
    }
    const handleShowGenerating = () => setShowGenerating(true);
    const handleCloseGenerating = () => setShowGenerating(false);


    const DeployLiveContracts = async() => {

        

        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        const liveMintFactoryContract = new ethers.ContractFactory(LiveMintFactory.abi, LiveMintFactory.bytecode, signer)
        const liveAuctionFactoryContract = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

        

        let liveMintContract = await liveMintFactoryContract.deploy(
                galleryName,
                gallerySymbol,
                signerAddress,
                mintNumber,
                royalty*100
            );

        
        try {
            
            await liveMintContract.deployTransaction.wait();
            setLoadingLiveMint(false)
        } catch {
            setLiveMintError(true)
            return
        }
         // loading before confirmed transaction
        

        const liveMintAddress = await liveMintContract.address
        let liveAuctionContract = await liveAuctionFactoryContract.deploy(
                liveMintAddress
            );
        
        try {
            
            await liveAuctionContract.deployTransaction.wait(); 
            setLoadingLiveAuction(false)
        } catch {
            setLiveAuctionError(true)
            return
        }

        

        try {
            await liveMintContract.transferOwnership(liveAuctionContract.address);
            
        } catch {
            setSaveDetailsError(true)
            return
        }
        

        const liveAuctionAddress = await liveAuctionContract.address
        await SubmitLiveMintData(liveMintAddress, liveAuctionAddress, signerAddress)
        setLoadingSaveDetails(false)
        setAuctionDeployed(true)

    }

    const SubmitLiveMintData = async(liveMintAddress, liveAuctionAddress, signerAddress) => {
        const LiveMintedCollection = Moralis.Object.extend("LiveMintedCollections")
        const liveMint = new LiveMintedCollection()

        setMintAddress(liveMintAddress)

        liveMint.set("StreamLink", stream);
        liveMint.set("MintNumber", mintNumber);
        liveMint.set("CollectionName", galleryName);
        liveMint.set("CollectionSymbol", gallerySymbol);
        liveMint.set("royalty", royalty*100);
        liveMint.set("description", description);
        liveMint.set("date", date);
        liveMint.set("startTime", startTime);
        liveMint.set("endTime", endTime);

        liveMint.set("liveMintAddress", liveMintAddress);
        liveMint.set("liveAuctionAddress", liveAuctionAddress);
        liveMint.set("signerAddress", signerAddress);

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



        await liveMint.save()
        
    }

    

    return (
    <>
      <MarketPlaceSection>
        <Container fluid className="p-3" style={{fontSize: 24, fontWeight: "bold"}}>
           <Row>
                <Col sm={10}>
                    NftyTunes <div style={{display: "inline-block"}}><img style={{display: "inline-block"}} src={live} height="15px" width="15px"></img> Live</div>: Putting Your Experiences On-Chain
                </Col>
                <Col sm={2}>
                    <Button variant="dark" style={{borderRadius: "5rem", float: "right"}} onClick={()=>handleShow()}>
                        + Create a Live Collection
                    </Button>
                </Col>
           </Row>
        </Container>
        <Container fluid className="p-0" style={{backgroundColor: "white"}}>
            <hr></hr>
            <Row className="p-2">
                <Col>    
                    <ProductListLayout>
                        <LiveCollectionIds/>
                    </ProductListLayout>   
                </Col> 
                    
            </Row>
        </Container>
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
                        value={galleryName}
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
                        value={gallerySymbol}
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
                        value={stream}
                        onChange={e => setStream(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.royalty">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Royalty %"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= 'Enter Royalty %'
                                value={royalty}
                                onChange={e => setRoyalty(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.mintNumber">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="# of NFTs to mint"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= '# of NFTs to Mint'
                                value={mintNumber}
                                onChange={e => setMintNumber(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <div className='d-flex justify-content-center m-1'>
                    <small className='text-dark'>Cover Art (Shown before NFT Metadata is Inserted)</small>
                </div>
                <div className='d-flex justify-content-center p-2'>
                    <Form.Group controlId = "uploadPhotoFile" style={{width: 275}}>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload Cover Art" 
                            onChange={(e) => {
                                try {
                                    setCoverArt(e.target.files?.item(0))
                                } catch {
                                    setMintErrMessage("Please submit .png .gif files only")
                                }
                            }}

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
                            onChange={(e) => {
                                try {
                                    setBannerImage(e.target.files?.item(0))
                                } catch {
                                    setMintErrMessage("Please submit .png .gif files only")
                                }
                                }}
                        />
                    </Form.Group>

                </div>
                {mintErrMessage &&
                        <Alert variant='danger'>
                        <i class="bi bi-radioactive"></i>
                        {'  '}{mintErrMessage}    
                    </Alert>
                }
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{handleNext();}}>
                    Next
                </Button>

            </Form>       
        </Modal>

        <Modal show={showTwo} onHide={handleCloseTwo} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Almost Done!
            </Modal.Title>
            <Form style={{padding: "30px"}}>
                <Form.Group className="mb-3" controlId="nft.description">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Collection Description"
                        className="mb-3"
                        rows={5}
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Collection Description'
                        value={description}
                        onChange={e => setDescription(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.Date">
                    <div style={{fontSize: 12}}>Concert Date</div>
                    <input
                        type="date"
                        name="from"
                        id="startdate"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="form-control datepicker"
                        style={{ width: "150px" }}
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.startTime" >
                            <div style={{fontSize: 12}}>Start Time</div>
                            <input
                                type="time"
                                name="from"
                                id="starttime"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="form-control timepicker"
                                style={{ width: "150px" }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.startTime" >
                            <div style={{fontSize: 12}}>End Time</div>
                            <input
                                type="time"
                                name="from"
                                id="endtime"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="form-control timepicker"
                                style={{ width: "150px" }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
 
                <Button variant="dark" style={{borderRadius: "2rem", float: "left"}} onClick={()=>{handleShow();handleCloseTwo()}}>
                    Back
                </Button>
                
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>handleGenerate()}>
                    Generate Contracts
                </Button>
     
            </Form>       
        </Modal>

        <Modal show={showGenerating} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Generating your Contracts
            </Modal.Title>
            <Row style={{padding: "30px 30px 0px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Deploying <span className="text-primary">Live </span><br/>Mint Contract</h4>
                    <small className='text-muted'>This contract will be used to <br/>mint your Live NFTs</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    
                    {(loadingLiveMint) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (liveMintError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                   
                </Col>
                
            </Row>
            <Row style={{padding: "30px 30px 0px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Deploying <span className="text-primary">Live </span>Auction Contract</h4>
                    <small className='text-muted'>This contract will be used to store bids on your Live NFTs</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    {(loadingLiveAuction) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (liveAuctionError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                </Col>
                
            </Row>
            <Row style={{padding: "30px 30px 30px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Transferring Ownership</h4>
                    <small className='text-muted'>Transferring Ownership of your <br/>Collection contract to your Auction</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    {(loadingSaveDetails) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (saveDetailsError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                </Col>
            </Row>
            {auctionDeployed &&
                <Alert variant='success' className="py-1">
                <i class="bi bi-check-circle-fill"></i>
                {' '} Congrats! Your collection and auction have been successfully deployed!
                <Alert.Link onClick={() => navigate(`${mintAddress}/${galleryName}`)}>View Auction Console</Alert.Link>
                </Alert>
            }
            {(liveMintError || liveAuctionError || saveDetailsError) && 
            <Row className="p-3">
                <Col>
                    <Button variant="dark" style={{borderRadius: "2rem", float: "left"}} onClick={()=>{handleShowTwo();handleCloseGenerating()}}>
                        Back
                    </Button>
                </Col>
                <Col>
                    <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{setLoadingLiveMint(true);
                    setLoadingLiveAuction(true);setLoadingSaveDetails(true);DeployLiveContracts();}}>
                        Redeploy Contracts
                    </Button>
                </Col>
            </Row>
            }
        </Modal>
    </>
    )
}

export default LiveMint
