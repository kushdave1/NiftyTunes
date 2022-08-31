import React, {useState} from 'react'
import {useNavigate} from 'react-router'

//Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Web3Modal from 'web3modal'
import nftyimg from '../../assets/images/NT_White_Isotype.png'
//APIs
import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import Moralis from 'moralis'
import { ethers } from 'ethers'
import { TypedDataUtils } from 'ethers-eip712'
import { changeBackgroundWhite, changeBackgroundBlack } from "../nftyFunctions/hover"

import { useNFTBalance } from "../../hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Tooltip, Spin, Input } from "antd";
import { signMyItem, deployMyGallery } from "../nftyFunctions/LazyFactoryAction";
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"


function NFTModalNftyLive(props) {

    let navigate = useNavigate()
    const {saveFile} = useMoralisFile();

     /* mint states */
     const [mintErrMessage, setMintErrMessage] = useState('');
     const [mintSuccessMsg, setMintSuccessMsg] = useState('');
     const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
     /* mint form states */
    const [name, setName] = useState('');
    const [galleryName, setGalleryName] = useState('');
    const [gallerySymbol, setGallerySymbol] = useState('');
    const [description, setDescription] = useState('');
    const [royalties, setRoyalties] = useState('');
    const [supply, setSupply] = useState(1);
    const [collectionSelectedYes, setCollectionSelectedYes] = useState(false);
    const [collectionSelectedNo, setCollectionSelectedNo] = useState(false);

    const [collectionSelectedNew, setCollectionSelectedNew] = useState(false);
    const [collectionSelectedExisting, setCollectionSelectedExisting] = useState(false);

    const [showCollectionOne, setShowCollectionOne] = useState(false)


    const [address, setAddress] = useState();
    const [nftData, setNftData] = useState();
    const [nfts, setNFTs] = useState([]);
    const [tokenURI, setTokenURI] = useState('');
    const { NFTBalance, fetchSuccess } = useNFTBalance();
    const { chainId, marketAddress, marketContractABI, nftyLazyFactoryAddress, nftyLazyContractABI } = useMoralisDapp();
    const [visible, setVisibility] = useState(false);
    const nftyLazyContractABIJson = JSON.parse(nftyLazyContractABI)
    const contractABIJson = JSON.parse(marketContractABI);
    const [nftToSend, setNftToSend] = useState(null);
    const [price, setPrice] = useState(1);
    const [listingPrice, setListingPrice] = useState(1);
    const [loading, setLoading] = useState(false);
    const [singleFile, setSingleFile] = useState()
    const [resultFile, setResultFile] = useState()
    const contractProcessor = useWeb3ExecuteFunction();
    const listItemFunction = "createMarketItem";
    const ItemImage = Moralis.Object.extend("ListedNFTs");
    const VoucherStorage = Moralis.Object.extend("Vouchers");
    const [mintProgressLabel, setMintProgressLabel] = useState('');
    const [mintProgress, setMintProgress] = useState();

    const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
    const SIGNING_DOMAIN_VERSION = "1"



    // Extraneous moralis functions -- ended up going with ethers for contract interaction 

    const SetAuctionTokenURI = async(tokenURI) => {

        const signer = await ConnectWallet()

        const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
        const liveAuctionFactoryContract = liveAuctionFactory.attach(props.auctionAddress);
        await liveAuctionFactoryContract.end(tokenURI)
  
    }



    const handleSaveIPFS = async (file) => {
        
        if(!name || !description){
            setMintErrMessage('Please enter a name and description to mint.');
        } else if (!file) {
            setMintErrMessage("Please upload a file to generate a TokenURI")
        }
        /*else if(isNaN(parseInt(supply)) || supply % 1 != 0){
            setMintErrMessage('Supply amount must be an integer.')
        }*/
        else{
            setMintErrMessage('');

        setMintProgress(10)
        setMintProgressLabel('Saving Content to IPFS')
        console.log(file.name, file)
        const arr = new Moralis.File(file.name, file)
        console.log(arr)
        const fileIPFS = await arr.saveIPFS();

        if(fileIPFS){
            setMintProgress(30)
            setMintProgressLabel('Uploading Metadata')
            let fileHash = fileIPFS._hash;

            console.log(fileIPFS._hash);
            console.log(fileIPFS._ipfs);
    
            //Create metadata with video hash & data
            const metadata = {
                name: name,
                description: description,
                image: '/ipfs/' + fileHash
            };
    
            console.log(metadata);
    
            //save metadata file and upload to rarible
            const metadataFileIPFS = await saveFile('metadata.json', {
                base64: btoa(JSON.stringify(metadata))
            }, {
                saveIPFS:true, 
                onSuccess: async (metadataFile) => {
                    setMintProgress(60)
                    setMintProgressLabel('Awaiting Signature')
                    await Moralis.enableWeb3();
                    const tokenURI = ('ipfs://' + metadataFile._hash);
                    await SetAuctionTokenURI(tokenURI);
                    console.log(tokenURI)
                    setMintProgress(100)
                    setMintProgressLabel('Done!')
                    setMintSuccessMsg(`Congrats, you have minted and listed your NFT for sale! `)
                    setMintProgress(null)
                    setMintProgressLabel(null)
                    
                }
            }); 
        }
    }
    }




    // button interaction to handle mint //

    const handleMint = (e) => {
        console.log(resultFile);
        handleSaveIPFS(resultFile);
    }

  return (
        <Modal show={props.show} onHide={props.toggleShow} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' style={{borderRadius: "2rem"}} keyboard={false} >
                        <Modal.Header style={{backgroundColor: "black"}} >
                            <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <h2 className='text-start fw-bold py-3 mb-3'>Ready to upload new metadata? Let's add some details. </h2>
                                <Col>
                                {/* NFT metadata */}
                                <Form>
                                <Form.Group className="mb-3" controlId="nft.Name">
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Name your masterpiece"
                                        className="mb-3"
                                    >
                                    <Form.Control 
                                        type="input"
                                        placeholder= 'Name your masterpiece'
                                        onChange={e => setName(e.target.value)}/>
                                    </FloatingLabel>
                                </Form.Group>

                                {/* Description */}
                                <Form.Group className="mb-3" controlId="nft.Desc">
                                    <FloatingLabel controlId="floatingInput" label="Give it a description">
                                        <Form.Control 
                                            as="textarea" 
                                            placeholder='Give it a description'
                                            rows={5}
                                            onChange={e => setDescription(e.target.value)}/>
                                    </FloatingLabel>
                                </Form.Group>
                            <div className='d-flex justify-content-center m-1'>
                                <small className='text-dark'>Upload NFT Video</small>
                            </div>
                            <div className='d-flex justify-content-center p-2'>
                                <Form.Group controlId = "uploadVideoFile" style={{width: 275}}>
                                    <Form.Control 
                                        type="file" 
                                        placeholder="Upload NFT Video" 
                                        onChange={(e) => {
                                            try {
                                                setResultFile(e.target.files?.item(0))
                                            } catch {
                                                setMintErrMessage("Please submit .mp4, .mov files only")
                                            }
                                            }}
                                    />
                                </Form.Group>
                            </div>
                            <Button variant="dark" style={{borderRadius: "2rem", marginTop: "20px", float: "right", width: "100px"}} 
                            onClick={()=>handleMint()}>
                                Upload
                            </Button>
                                </Form>
                                
                                {mintSuccessMsg &&
                                    <Alert variant='success'>
                                    <i class="bi bi-check-circle-fill"></i>
                                {' '} {mintSuccessMsg}
                                    <Alert.Link onClick={() => props.toggleShow}>Go Back to Auction Console</Alert.Link>
                                    </Alert>
                                }
                                {mintProgress && mintProgressLabel &&
                                    <Container>
                                        <ProgressBar animated variant="primary" now={mintProgress}/>
                                        <div class = "d-flex justify-content-center mt-2">
                                            <Badge bg="dark">{mintProgressLabel}</Badge>
                                        </div>
                                    </Container>
                                }
                                </Col>
                            </Row>
                           {/*NFT metadata end */}
                        </Modal.Body>
                </Modal>
  )
}

export default NFTModalNftyLive