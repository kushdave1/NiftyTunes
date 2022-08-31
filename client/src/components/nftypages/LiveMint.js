import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

//Explore components
import LiveCollectionIds from '../nftymarketplace/LiveCollectionIds'

//Layouts
import CollectionListLayout from '../nftylayouts/CollectionListLayout'
import ProductCardsLayout from '../nftylayouts/ProductCardsLayout'
import ProductListLayout from '../nftylayouts/ProductListLayout'
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
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'

import {
    BrowserRouter as Router,
    Routes, 
    Route, 
    Link,
    Outlet
} from "react-router-dom"

import nftyimg from "../../assets/images/NT_White_Isotype.png";
import xicon from '../../assets/images/xicon.png'
import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'
import bunnies from "../../assets/images/livebunnies.gif"
import liveButton from "../../assets/images/LiveButton.png"
import pdfHowItWorks from "../../assets/images/pdfHowItWorks.png"

//Moralis
import { useMoralis, useMoralisFile } from 'react-moralis'
import Moralis from 'moralis'

// NFTY HOOKS
import { fetchArtistName } from "../nftyFunctions/fetchCloudData"
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import NicknameModal from '../nftyModals/NicknameModal'
import HowItWorksModal from '../nftyModals/HowItWorksModal'
import ModalOne from '../nftyModals/createAuctionModals/ModalOne'
import ModalTwo from '../nftyModals/createAuctionModals/ModalTwo'
import ModalThree from '../nftyModals/createAuctionModals/ModalThree'

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
    const [showThree, setShowThree] = useState(false)

    const [stream, setStream] = useState("")
    const [mintNumber, setMintNumber] = useState("")
    const [royalty, setRoyalty] = useState()
    const [coverArt, setCoverArt] = useState("")
    const [date, setDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [description, setDescription] = useState("")
    const [mintAddress, setMintAddress] = useState("")
    const [auctionArray, setAuctionArray] = useState([])

    const [nickname, setNickname] = useState("")

    const [showPDF, setShowPDF] = useState(false)

    
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

    const [showWelcomeModal, setShowWelcomeModal] = useState(false)

    const handleCloseWelcomeModal = () => setShowWelcomeModal(false)

    const handleShowPDF = () => setShowPDF(true)
    const handleClosePDF = () => setShowPDF(false)

    const [nftsPerAuction, setNFTsPerAuction] = useState([])

    const handleShow = () => setShow(true)
    const handleClose = () => {
        setShow(false)
        setMintErrMessage("")
    }

    useEffect(async() => {
        let username
        try {
            console.log(user.attributes.ethAddress, "this username guys")
            username = await fetchArtistName(user.attributes.ethAddress)
            console.log(username, "this puser guys")
            if (username.length !== 25) {
                handleCloseWelcomeModal()
            } else {
                setShowWelcomeModal(true)
            }
            if (username.length !== undefined) {
                handleCloseWelcomeModal()
            } else {
                setShowWelcomeModal(true)
            }
        } catch {
            setShowWelcomeModal(true)
        }
    }, [user])



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

    const handleNextTwo = () => {
        
        if(!description) {
            setMintErrMessage("Please enter a description.")
        } 
        else if(!date || !startTime || !endTime) {
            setMintErrMessage("Please enter Time Specs for your auction")
        } else if(parseInt(endTime.split(":")[0]) < parseInt(startTime.split(":")[0])) {
            console.log("hii")
            setMintErrMessage("End Time cannot be before Start Time")
        } else if((parseInt(endTime.split(":")[0])  === parseInt(startTime.split(":")[0])) && (parseInt(endTime.split(":")[1]) < parseInt(startTime.split(":")[1]))) {
            setMintErrMessage("End Time cannot be before Start Time")
        }
        else {
            setAuctionArray(Array.from(Array(parseInt(mintNumber)).keys()))
            setMintErrMessage("")
            setShowTwo(false);
            handleShowThree()
        }
    }

    const handleGenerate = () => {
        handleCloseThree()
        handleShowGenerating()
        DeployLiveContracts()
    }

    const handleShowThree = () => setShowThree(true);
    const handleCloseThree = () => setShowThree(false);

    const handleShowGenerating = () => setShowGenerating(true);
    const handleCloseGenerating = () => setShowGenerating(false);


    const DeployLiveContracts = async() => {

        const signer = await ConnectWallet()
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

        let transaction = await liveMintContract.transferOwnership(liveAuctionContract.address);

        try {
            await transaction.wait()
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

        const filteredEditions = nftsPerAuction.filter(function(auction) {return auction.editions != " "})


        liveMint.set("StreamLink", stream);
        liveMint.set("MintNumber", mintNumber);
        liveMint.set("CollectionName", galleryName);
        liveMint.set("CollectionSymbol", gallerySymbol);
        liveMint.set("royalty", royalty*100);
        liveMint.set("description", description);
        liveMint.set("date", date);
        liveMint.set("startTime", startTime);
        liveMint.set("endTime", endTime);
        liveMint.set("editionsPerAuction", filteredEditions)
        liveMint.set("totalEditions", filteredEditions.reduce(function (x, y) {
            return x + y;
        }, 0))
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

    const updateNFTsPerAuction = (auction) => e => {
        let newArr = [...nftsPerAuction]
        newArr[auction] = e.target.value
        console.log(newArr, 'hercules')

        setNFTsPerAuction(newArr)
        console.log(nftsPerAuction)
    }

    const submitName = async() => {
        user.set("username", nickname)
        await user.save();
    }





    

    return (
    <>
    
      <MarketPlaceSection>
        <Container fluid className="p-3" style={{fontSize: 24, fontWeight: "bold"}}>
           <Row>
           
                
                <Col style={{display: "flex", paddingBottom:"20px", justifyContent: "center", alignItems: "center"}}>
                    NftyTunes Live
                </Col>
            </Row>
           <Row>
                <Col >
                    <Button variant="light" style={{borderRadius: "5rem", float: "left", borderColor: "white", boxShadow: "2px 2px 2px 2px #888888"}} onClick={()=>handleShowPDF()}>
                        How it Works
                    </Button>
                </Col>
                <Col >
                    <Button variant="light" style={{borderRadius: "5rem", float: "right", borderColor: "white", boxShadow: "2px 2px 2px 2px #888888"}} onClick={()=>handleShow()}>
                        +Create Collection
                    </Button>
                </Col>
            </Row>
            
        </Container>
        <Container fluid style={{backgroundColor: "white"}}>
            <Nav className="justify-content-left nav-tabs">
                <Nav.Item>
                    <Nav.Link as={Link} className = "text-dark-3" to="onsale">Past</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} className = "text-dark-3" to="sold">Live</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} className = "text-dark-3" to="owned">Upcoming</Nav.Link>
                </Nav.Item>
                
            </Nav>

                    <CollectionListLayout>
                        <LiveCollectionIds/>
                    </CollectionListLayout>   

                    

        </Container>
      </MarketPlaceSection>

        <NicknameModal showWelcomeModal={showWelcomeModal} handleCloseWelcomeModal={handleCloseWelcomeModal} 
        setNickname={setNickname} nickname={nickname} submitName={submitName}/>
        
        <HowItWorksModal showPDF={showPDF} handleClosePDF={handleClosePDF} pdfHowItWorks={pdfHowItWorks} />

        <ModalOne show={show} handleClose={handleClose} galleryName={galleryName} setGalleryName={setGalleryName} 
        gallerySymbol={gallerySymbol} setGallerySymbol={setGallerySymbol} stream={stream} setStream={setStream}
        royalty={royalty} setRoyalty={setRoyalty} mintNumber={mintNumber} setMintNumber={setMintNumber} 
        coverArt={coverArt} setCoverArt={setCoverArt} bannerImage={bannerImage} setBannerImage={setBannerImage}
        handleNext={handleNext} mintErrMessage={mintErrMessage} setMintErrMessage={setMintErrMessage}/>

        <ModalTwo showTwo={showTwo} handleCloseTwo={handleCloseTwo} description={description} setDescription={setDescription}
        date={date} setDate={setDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime}
        mintErrMessage={mintErrMessage} handleShow={handleShow} handleCloseTwo={handleCloseTwo} handleNextTwo={handleNextTwo} />

        <ModalThree showThree={showThree} handleCloseThree={handleCloseThree} auctionArray={auctionArray} handleShowTwo={handleShowTwo}
        handleGenerate={handleGenerate} mintErrMessage={mintErrMessage} updateNFTsPerAuction={updateNFTsPerAuction}/>


        

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
