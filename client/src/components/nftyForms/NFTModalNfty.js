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
import Web3Modal from 'web3modal'
import nftyimg from '../../assets/images/NT_White_Isotype.png'
//APIs
import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import Moralis from 'moralis'
import { ethers } from 'ethers'
import { TypedDataUtils } from 'ethers-eip712'


import { useNFTBalance } from "../../hooks/useNFTBalance";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";

function NFTModalNfty(props) {
    /* navigate hook */
    let navigate = useNavigate();

    /* mint states */
    const [mintErrMessage, setMintErrMessage] = useState('');
    const [mintSuccessMsg, setMintSuccessMsg] = useState('');
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    /* mint form states */
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [royalties, setRoyalties] = useState('');
    const [supply, setSupply] = useState(1);


    const [address, setAddress] = useState();
    const [nftData, setNftData] = useState();
    const [nfts, setNFTs] = useState([]);
    const [tokenURI, setTokenURI] = useState('');
    const { NFTBalance, fetchSuccess } = useNFTBalance();
    const { chainId, marketAddress, marketContractABI } = useMoralisDapp();
    const [visible, setVisibility] = useState(false);
    const contractABIJson = JSON.parse(marketContractABI);
    const [nftToSend, setNftToSend] = useState(null);
    const [price, setPrice] = useState(1);
    const [listingPrice, setListingPrice] = useState(1);
    const [loading, setLoading] = useState(false);
    const contractProcessor = useWeb3ExecuteFunction();
    const listItemFunction = "createMarketItem";
    const ItemImage = Moralis.Object.extend("ListedNFTs");

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




    // Listing and minting your NFT //



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
        console.log(props.videoTokenId, props.videoTokenAddress, props.audioTokenId, props.audioTokenAddress)

        let approveTransaction = await contract.setApprovalForAll(marketAddress, true)
        await approveTransaction.wait()

        let transaction = await contract.createBredToken(props.videoTokenId, props.videoTokenAddress, props.audioTokenId, props.audioTokenAddress, url)
        await transaction.wait()
        console.log('success for sure')
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
        console.log(file, name)
        const arr = new Moralis.File("file.mp4", file, {base64: 'video/mp4'})
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
                    const listNFT = await listNFTForSale(tokenURI, listingPrice, royalties);
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


    // Lazy mint testing //

    const typedData = {
      EIP712Domain: [
        {name: "name", type: "string"},
        {name: "version", type: "string"},
        {name: "chainId", type: "uint256"},
        {name: "verifyingContract", type: "address"},
      ],
      NFTVoucher: [
        {name: "tokenId", type: "uint256"},
        {name: "minPrice", type: "uint256"},
        {name: "uri", type: "string"},  
      ]
    }

    async function _signingDomain(chain, contractAddress) {

        const _domain = {
            name: SIGNING_DOMAIN_NAME,
            version: SIGNING_DOMAIN_VERSION,
            verifyingContract: contractAddress,
            chain,
        }
        return _domain
    }

    
    

    async function formatVoucher(voucher) {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const chainId = await signer.getChainId()
        const contract = new ethers.Contract(marketAddress, contractABIJson, signer)

        const domain = await _signingDomain(chainId, contract)
        return {
        domain,
        types: typedData,
        primaryType: 'NFTVoucher',
        message: voucher,
        }
    }

    async function createVoucher(tokenId, uri, minPrice) {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const voucher = { tokenId, uri, minPrice }
        const typedData = await formatVoucher(voucher)
        const digest = TypedDataUtils.encodeDigest(typedData)
        const signature = await signer.signMessage(digest)
        return {
        voucher,
        signature,
        digest,
        }
    }




    // button interaction to handle mint //

    const handleMint = (e) => {
        e.preventDefault();
        handleSaveIPFS(props.resultFile);
    }

  return (
        <Modal show={props.show} onHide={props.toggleShow} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' backdrop="static" keyboard={false} >
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
                            <div className='d-flex justify-content-center mt-0'>
                                <small className='text-muted'>Make sure to turn the sound all the way up!</small>
                            </div>
                        </Row>
                        <Row className='mb-5'>
                            <Col>
                            <div className='d-flex justify-content-center mb-5 '>
                                <Button variant="dark" className = 'w-75' onClick={props.toggleShow}>
                                    Meh, let me try that again
                                </Button>
                            </div>
                            </Col>
                        </Row>
                        <Row>
                            <h2 className='text-start fw-bold py-3 mb-3'>Ready to mint? Let's add some details. </h2>
                            <Col>
                             {/* NFT metadata */}
                           <Form>
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
                                    
                                    <Button variant="outline-secondary" disabled><i class="bi bi-percent"></i>
                                        </Button>
                                 </InputGroup>
            
                           </Form>
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

export default NFTModalNfty