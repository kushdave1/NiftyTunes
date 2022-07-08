//React
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//Bootstrap
import Container from 'react-bootstrap/Container'
import NFTForm from '../nftyForms/NFTForm'
import MadeNFTForm from '../nftyForms/MadeNFTForm'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Board from '../nftyDraggable/board';
import Cards from '../nftyDraggable/cards';

//Pages
import ProductCardsLayoutMixer from '../nftylayouts/ProductCardsLayoutMixer'

//Moralis
import Moralis from 'moralis'
import $ from "jquery"
import { useNFTBalance } from "../../hooks/useNFTBalance";
import { useNFTBalances, useERC20Balances } from "react-moralis"
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Tooltip, Spin, Input } from "antd";
import { useIPFS } from "hooks/useIPFS";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios';
import { useMoralisWeb3Api } from "react-moralis";

//APIs
import {useRaribleLazyMint, useMoralis} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'

let ffmpeg = createFFmpeg({log: true});


const Body = styled.div `
    width:100%;
    height: 100vh;
    min-height:100vh;
    max-height:100vh;
    display:flex;
    flex-direction:column;
    background-color:white;
    overflow:auto;
`;

const FormSection = styled.div `
    flex:1;
    overflow:hidden;
`;
const ChoiceSection = styled.div `

`;

function CreateNFT() {
    const { resolveLink } = useIPFS();
    const {isAuthenticated, user} = useMoralis();
    const [isReadyMade, setIsReadyMade] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [ready, setReady] = useState(false);
    const [address,setAddress] = useState();
    const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
    const { chainId, marketAddress, marketContractABI, storageAddress, storageContractABI, collectionContractABI, collectionAddress } = useMoralisDapp();
    const storageContractABIJson = JSON.parse(storageContractABI);
    const collectionContractABIJson = JSON.parse(collectionContractABI);
    const Web3Api = useMoralisWeb3Api();
    const [visible, setVisibility] = useState(false);
    const marketContractABIJson = JSON.parse(marketContractABI);
    const [audioNFTs, setAudioNFTs] = useState([{
        name: "",
        description: "",
        image: "",
        owner: "",
        tokenId: "",
        tokenAddress: ""
    }]);
    const [visualNFTs, setVisualNFTs] = useState([{
        name: "",
        description: "",
        image: "",
        owner: "",
        tokenId: "",
        tokenAddress: ""
    }]);
    const [loading, setLoading] = useState(false);

    const load = async() => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        if(!user) return null;
        
        setAddress(user.get('ethAddress'));
        getNFT();
        if(!ffmpeg.isLoaded()){
            load();
        }
        else{
            setReady(true)
        }
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

    // const NFTBalances = async() => {
    //     const web3Modal = new Web3Modal({})
    //     const connection = await web3Modal.connect()
    //     const provider = new ethers.providers.Web3Provider(connection)
    //     const signer = provider.getSigner()

    //     const marketplaceContract = new ethers.Contract(marketAddress, marketContractABIJson, signer)

    //     const storageContract = new ethers.Contract(storageAddress, storageContractABIJson, signer)

    //     const data = await storageContract.fetchMyNFTs()

    //     const items = await Promise.all(data.map(async i => {
    //     const tokenURI = await marketplaceContract.tokenURI(i.tokenId)

    //     const meta = await axios.get(fixURL(tokenURI))
    //     console.log(meta)
    //     let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    //     let item = {
    //         price,
    //         tokenId: i.tokenId.toNumber(),
    //         seller: i.seller,
    //         owner: i.owner,
    //         image: fixImageURL(meta.data.image),
    //         name: meta.data.name,
    //         description: meta.data.description,
    //         tokenURI
    //     }
    //     return item
    //     }))
    //     setNFTs(items)
    //     console.log(items);
    //     setLoading(true) 
    // }
    const getNFT = async() => {
        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const network = await provider.getNetwork(); 
        const name = network.name;
        const signer = provider.getSigner()
        console.log(name)
        const signerAddress = await signer.getAddress();

        const collectionContract = new ethers.Contract(collectionAddress, collectionContractABIJson, signer)


        const dataMarkets = await getNFTBalances({ params: { chain: name } })
        const results = dataMarkets.result
        const itemsAudio = []
        const itemsVisual = []
        let image = ''
        let imageBon = ''
        let imageLink = ''
        //let meta = ''
        for (const i in results) {
            const object = results[i];
            if (object?.token_uri) {
            let meta = await axios.get(fixURL(object.token_uri))
            for (const j in meta.data) {
                if ((meta.data[j]).toString().includes('ipfs')) {
                    imageLink = meta.data[j]
                    image = resolveLink(meta.data[j])
                }}
            let item = {
                name: meta.data['name'],
                description: meta.data['description'],
                image: imageLink,
                owner: object.owner_of,
                tokenId: object.token_id,
                tokenAddress: object.token_address
            }
            if (audioNFTs.includes(item) === false && visualNFTs.includes(item) === false) {
            if (item.image.includes('mp3')) {
                console.log(item)
                setAudioNFTs((previousNft) => [...previousNft, {
                name: meta.data['name'],
                description: meta.data['description'],
                image: imageLink,
                owner: object.owner_of,
                tokenId: object.token_id,
                tokenAddress: object.token_address
            }])
            } else {
                setVisualNFTs((previousNft) => [...previousNft, {
                name: meta.data['name'],
                description: meta.data['description'],
                image: imageLink,
                owner: object.owner_of,
                tokenId: object.token_id,
                tokenAddress: object.token_address
            }])
            }
            }
        }
        console.log(itemsVisual)
    }
    }


    function handleNew(){
        setIsReadyMade(false);
        setIsNew(true);
    }

    function handleReadyMade(){
        setIsNew(false)
        setIsReadyMade(true)
    }
    return (
        <React.Fragment>
                
                {ready?(
                
                <Body>
                    <Row>
                    
                        <Col style={{display: "flex", paddingTop: "105px", justifyContent: "center"}}>
                            <Board id="board-1" className="board">
                                <Card style={{background: "#FAFDFF", padding: "10px"}}>
                                    <Card.Title>Visual</Card.Title>
                                    <ListGroup> 
                                    {visualNFTs && visualNFTs.map((nft, index) => (
                                        <ListGroup.Item style={{background: "linear-gradient(#F0FFFF, #FFB6C1)"}}>
                                            <Cards id={index} draggable="true">
                                                { (nft.name !== "") ? (
                                                <ProductCardsLayoutMixer id={index} key={index} lazy={nft.lazy} tokenAddress={nft.tokenAddress} voucher={nft.voucher} gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} owner={nft.owner} description={nft.description} tokenId={nft.tokenId} price={nft.price}/>
                                                ) : (null)}
                                            </Cards>
                                        </ListGroup.Item>
                                    ))}
                                    </ListGroup>
                                </Card>
                            </Board>
                        </Col>
                    
                        <Col xs={5}>
                            <ChoiceSection className="d-flex mt-1 justify-content-center" style={{paddingTop: "50px"}}>
                                <Stack direction="horizontal" gap={2}>
                                    <Button 
                                        variant="primary"
                                        onClick={handleNew}>
                                        I want to make an NFT
                                    </Button>{' '}

                                <Button 
                                    variant="outline-dark"
                                    onClick={handleReadyMade}>
                                    I already have an NFT
                                </Button>{' '}
                            </Stack>
                        </ChoiceSection>

                        <FormSection className="d-flex mt-3 justify-content-center">
                            {
                                isNew?(
                                    <NFTForm 
                                        ffmpeg = {ffmpeg}
                                        address = {address} />
                                ):(
                                    <MadeNFTForm 
                                        ffmpeg = {ffmpeg}
                                        address = {address}/>
                                )
                            
                            }
                                
                        </FormSection>
                        </Col>
                        <Col style={{display: "flex", paddingTop: "105px", justifyContent: "center"}}>
                            <Board id="board-1" className="board">
                                <Card style={{background: "#FAFDFF", padding: "10px"}}>
                                    <Card.Title>Audio</Card.Title>
                                    <ListGroup> 
                                    {audioNFTs && audioNFTs.map((nft, index) => (
                                        <ListGroup.Item style={{background: "linear-gradient(#F0FFFF, #FFB6C1)"}}>
                                            <Cards id={index} className="card" draggable="true">
                                                { (nft.name !== "") ? (
                                                <ProductCardsLayoutMixer id={index} key={index} lazy={nft.lazy} voucher={nft.voucher} gallery={nft.gallery} nft={nft} image={nft?.image} name={nft.name} owner={nft.owner} description={nft.description} tokenId={nft.tokenId} price={nft.price}/>
                                                ) : (null)}
                                            </Cards>
                                        </ListGroup.Item>
                                    ))}
                                    </ListGroup>
                                </Card>
                            </Board>
                        </Col>
                    </Row>
                    
                </Body>
                    
                ):(
                    <Body>
                        <Container fluid>
                            <Row className = 'mt-5'>
                                <div className='d-flex justify-content-center'>
                                    <h1 className = 'text-primary animate__animated animate__bounce animate__infinite infinite' style={{ fontFamily:"Pixeboy"}}>NiftyTunes</h1>
                                </div>
                            </Row>
                            <Row className = 'mt-5'>
                                <div className='d-flex justify-content-center'>
                                    <h6 className = 'text-primary' style={{fontWeight:"700"}}>Loading Packages...</h6>
                                </div>
                            </Row>
                            <Row>
                                <div className='d-flex justify-content-center'>
                                 <Spinner as='span' animation="border" variant='primary'/>
                                </div>
                            </Row>
                        </Container>
                    </Body>
                    )
                }

        </React.Fragment>
                   
    )
}

export default CreateNFT
