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

function NFTModalNftyLazy(props) {

    let navigate = useNavigate()

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
    const contractProcessor = useWeb3ExecuteFunction();
    const listItemFunction = "createMarketItem";
    const ItemImage = Moralis.Object.extend("ListedNFTs");
    const VoucherStorage = Moralis.Object.extend("Vouchers");

    const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
    const SIGNING_DOMAIN_VERSION = "1"




    /* moralis functions */
    const {saveFile} = useMoralisFile();
    const {lazyMint} = useRaribleLazyMint({
        chain: 'eth',
        userAddress: props.userAddress,
        tokenType: 'ERC721', 
        supply: 1, //parseInt(supply) 
        royaltiesAmount: parseInt(royalties) * 100
 });




    // Extraneous moralis functions -- ended up going with ethers for contract interaction /


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



    // Listing and minting your NFT //

    async function listNFTForLazy(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        const price = ethers.utils.parseUnits(listingPrice, 'ether')
        const royaltyFee = royalties
        const royaltyFeeFinal = ethers.utils.parseUnits(royaltyFee, 'wei')

        const galleryAddress = await deployMyGallery(marketAddress, galleryName, gallerySymbol)
        await signMyItem(galleryAddress, name, listingPrice, url, royaltyFee, singleFile, saveFile, true)
    }

    async function listNFTOnNfty(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        const price = ethers.utils.parseUnits(listingPrice, 'ether')
        const royaltyFee = royalties
        const royaltyFeeFinal = ethers.utils.parseUnits(royaltyFee, 'wei')
        console.log(singleFile)
        await signMyItem(nftyLazyFactoryAddress, name, listingPrice, url, royaltyFee, singleFile, saveFile, false)
    }



    const handleSaveIPFS = async (file) => {
        
        if(!name || !description){
            setMintErrMessage('Please enter a name and description to mint.');
        }
        else if(isNaN(parseInt(royalties)) || parseInt(royalties) % 1 != 0){
            setMintErrMessage('Royalty amount must be an integer.')
        }
        /*else if(isNaN(parseInt(supply)) || supply % 1 != 0){
            setMintErrMessage('Supply amount must be an integer.')
        }*/
        else{
            setMintErrMessage('');

        props.setMintProgress(10)
        props.setMintProgressLabel('Saving Content to IPFS')
        console.log(file.name, file)
        const arr = new Moralis.File(file.name, file)
        console.log(arr)
        const fileIPFS = await arr.saveIPFS();

        if(fileIPFS){
            props.setMintProgress(30)
            props.setMintProgressLabel('Uploading Metadata')
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
                    props.setMintProgress(60)
                    props.setMintProgressLabel('Awaiting Signature')
                    await Moralis.enableWeb3();
                    const tokenURI = ('ipfs://' + metadataFile._hash);
                    if (collectionSelectedNo) {
                      const success = await listNFTOnNfty(tokenURI);
                    } else {
                      const success = await listNFTForLazy(tokenURI);
                    }
                    props.setMintProgress(100)
                    props.setMintProgressLabel('Done!')
                    setMintSuccessMsg(`Congrats, you have minted and listed your NFT for sale! `)
                    props.setMintProgress(null)
                    props.setMintProgressLabel(null)
                    
                }
            }); 
        }
    }
    }




    // button interaction to handle mint //

    const handleMint = (e) => {
        console.log(props.resultFile);
        e.preventDefault();
        handleSaveIPFS(props.resultFile);
    }

  return (
        <Modal show={props.show} onHide={props.toggleShow} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' backdrop="static" style={{borderRadius: "2rem"}} keyboard={false} >
                        <Modal.Header style={{backgroundColor: "black"}} >
                            <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
                        </Modal.Header>
                        <Modal.Body>

                        <h2 className='text-start fw-bold py-3 mb-3'>Done, let's take a look!</h2>
                        <Row className='mb-3'>
                            <Col>
                                <div className='d-flex justify-content-center'>
                                     {props.fileType == 'img' && 
                                        <img
                                            className="rounded shadow mb-5"
                                            width="400"
                                            src={props.output}>
                                        </img>
                                    }
                                    {props.fileType == 'video' &&
                                        <video
                                            className="rounded shadow mb-5"
                                            controls
                                            width="400"
                                            src={props.output}
                                            loop={true}
                                            autoPlay
                                            muted>
                                        </video>
                                    }
                                    {props.fileType == 'audio' &&
                                        <audio
                                            className="rounded shadow mb-5"
                                            controls
                                            width="400"
                                            src={props.output}
                                            loop={true}
                                            autoPlay
                                            muted>
                                        </audio>
                                    }
                                </div>
                            </Col>
                            {(props.fileType == 'audio') ? (
                              <>
                              <div className='d-flex justify-content-center mt-0'>
                                <small className='text-muted'>Upload a cover for your mp3!</small>
                              </div>
                              <div className='d-flex justify-content-center m-2'>
                                  <FormGroup controlId = "uploadVideoFile" style={{width: 275}}>
                                    <Form.Control 
                                          type="file" 
                                          placeholder="Upload File" 
                                          onChange={(e) => setSingleFile(e.target.files?.item(0))}
                                      />
                                  </FormGroup>
       
                              </div>

                              </>
                            ) : (console.log("hi"))}
                            <div className='d-flex justify-content-center mt-4'>
                                <small className='text-muted'>Make sure to turn the sound all the way up!</small>
                            </div>
                        </Row>
                        <Row className='mb-5'>
                            <Col>
                            <div className='d-flex justify-content-center mb-2 '>
                                <Button variant="dark" className = 'w-75' onMouseEnter={changeBackgroundBlack} onMouseOut={changeBackgroundWhite} onClick={props.toggleShow}>
                                    Meh, let me try that again
                                </Button>
                            </div>
                            </Col>
                        </Row>
                        <Row>
                            <h2 className='text-start fw-bold py-3 mb-3'>Ready to mint? Let's add some details. </h2>
                            <Col>
                             {/* NFT metadata */}
                            <center>
                              <div>Is this NFT part of a collection?</div>
                              <ButtonGroup style={{width: "75%", padding: "20px"}}>
                                  <Button variant={(collectionSelectedYes) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setCollectionSelectedYes(true);console.log(props);setCollectionSelectedNo(false);}}>Yes</Button>
                                  <Button variant={(collectionSelectedNo) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setCollectionSelectedYes(false);setCollectionSelectedNo(true);}}>No</Button>
                              </ButtonGroup>
                            </center>

                            {collectionSelectedNo && 
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
                              <Form.Group className="mb-3" controlId="nft.Desc">
                                  <FloatingLabel controlId="floatingInput" label="Set your Listing Price">
                                      <Form.Control 
                                          as="textarea" 
                                          placeholder='Set your Listing Price'
                                          rows={5}
                                          onChange={e => setListingPrice(e.target.value)}/>
                                  </FloatingLabel>
                              </Form.Group>
                              <InputGroup className="mb-3 justify-content-center">
                                  <FloatingLabel controlId="floatingInput" label="Set your royalty">
                                      <Form.Control 
                                          as="input" 
                                          placeholder="Set your royalty percentage"
                                          aria-label="Dollar amount (with dot and 1 decimal places)" 
                                          onChange={e => setRoyalties(e.target.value)}/>
                                  </FloatingLabel>
                                  
                                  <Button variant="outline-secondary" disabled><i className="bi bi-percent"></i>
                                  </Button>
                              </InputGroup>
              
                            </Form>
                            }

                            {collectionSelectedYes && 
                            <center>
                              <div>Are you adding to a new or existing collection?</div>
                              <ButtonGroup style={{width: "75%", padding: "20px"}}>
                                  <Button variant={(collectionSelectedNew) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setCollectionSelectedNew(true);setCollectionSelectedExisting(false);}}>New</Button>
                                  <Button variant={(collectionSelectedExisting) ? ("dark") : ("light")} style={{border: "1px solid black"}} onClick={()=>{setCollectionSelectedNew(false);setCollectionSelectedExisting(true);}}>Existing</Button>
                              </ButtonGroup>
                            </center>
                            }

                            {collectionSelectedYes && collectionSelectedNew &&
                            <Form>
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
                                {/* Name */}
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
                              <Form.Group className="mb-3" controlId="nft.Desc">
                                  <FloatingLabel controlId="floatingInput" label="Set your Listing Price">
                                      <Form.Control 
                                          as="textarea" 
                                          placeholder='Set your Listing Price'
                                          rows={5}
                                          onChange={e => setListingPrice(e.target.value)}/>
                                  </FloatingLabel>
                              </Form.Group>
                              <InputGroup className="mb-3 justify-content-center">
                                <FloatingLabel controlId="floatingInput" label="Set your royalty">
                                    <Form.Control 
                                          as="input" 
                                          placeholder="Set your royalty percentage"
                                          aria-label="Dollar amount (with dot and 1 decimal places)" 
                                          onChange={e => setRoyalties(e.target.value)}/>
                                </FloatingLabel>
                                
                                <Button variant="outline-secondary" disabled><i className="bi bi-percent"></i>
                                </Button>
                              </InputGroup>
            
                           </Form>

                            }

                            {collectionSelectedYes && collectionSelectedExisting &&
                            <Form>
                              <Form.Group className="mb-3" controlId="nft.galleryName">
                                  <Form.Select>
                                    <option>Select your Collection</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                  </Form.Select>
                              </Form.Group>
                                {/* Name */}
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
                              <Form.Group className="mb-3" controlId="nft.Desc">
                                  <FloatingLabel controlId="floatingInput" label="Set your Listing Price">
                                      <Form.Control 
                                          as="textarea" 
                                          placeholder='Set your Listing Price'
                                          rows={5}
                                          onChange={e => setListingPrice(e.target.value)}/>
                                  </FloatingLabel>
                              </Form.Group>
                              <InputGroup className="mb-3 justify-content-center">
                                <FloatingLabel controlId="floatingInput" label="Set your royalty">
                                    <Form.Control 
                                          as="input" 
                                          placeholder="Set your royalty percentage"
                                          aria-label="Dollar amount (with dot and 1 decimal places)" 
                                          onChange={e => setRoyalties(e.target.value)}/>
                                </FloatingLabel>
                                
                                <Button variant="outline-secondary" disabled><i className="bi bi-percent"></i>
                                </Button>
                              </InputGroup>
            
                            </Form>

                            }

                           
                           </Col>
                        </Row>
                        <Row>
                            <div className='d-flex justify-content-center mt-1 mb-5'>
                                <Button variant="outline-primary" className = 'w-75' onClick={handleMint}>
                                    Let's mint!
                                </Button>
                            </div>
                        </Row>
                            {mintErrMessage &&
                                 <Alert variant='danger'>
                                 <i class="bi bi-radioactive"></i>
                                 {'  '}{mintErrMessage}    
                              </Alert>
                            }
                            {mintSuccessMsg &&
                                <Alert variant='success'>
                                <i class="bi bi-check-circle-fill"></i>
                               {' '} {mintSuccessMsg}
                                <Alert.Link onClick={() => navigate('/profile/onsale')}>View in your profile</Alert.Link>
                                </Alert>
                            }
                            {props.mintProgress && props.mintProgressLabel &&
                                <Container>
                                    <ProgressBar animated variant="primary" now={props.mintProgress}/>
                                    <div class = "d-flex justify-content-center mt-2">
                                        <Badge bg="dark">{props.mintProgressLabel}</Badge>
                                    </div>
                                </Container>

                            }
                           {/*NFT metadata end */}
                        </Modal.Body>
                </Modal>
  )
}

export default NFTModalNftyLazy