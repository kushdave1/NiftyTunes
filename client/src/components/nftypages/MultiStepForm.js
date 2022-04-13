//React
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//custom components
import NFTForm from '../NFTForm'
import MadeNFTForm from '../MadeNFTForm'

import FileDropzone from '../nftymix/FileDropzone'
import NFTMixer from '../nftymix/NFTMixer'
import NFTMinter from '../nftymix/NFTMinter'


//Bootstrap
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

//APIs
import {useRaribleLazyMint, useMoralis} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'


let ffmpeg = createFFmpeg({log: true});


const FormSection = styled.div `
    
`;
const ChoiceSection = styled.div `

`;

function MultiStepForm() {
    //user states
    const {isAuthenticated, user} = useMoralis();
    const [address,setAddress] = useState();
    
    //load states
    const [ready, setReady] = useState(false);

    //form states
    const [page, setPage] = useState(0);
    const [formData, setFormData] = useState({
        visualFile: null, 
        audioFile: null, 
        outputFile: null,
        playerSrc: null, 
        nftName: "", 
        nftDesc: "", 
        nftListPrice: 0, 
        nftRoyalty: 0
    });

    //form html displays
    const FormTitles = ['Upload 2 files', 'View your NFTYTUNE', 'Sprinkle on some metadata']
    const PageDisplay = () => {
        if(page === 0){
            return <FileDropzone formData = {formData} setFormData = {setFormData} />;
        }
        else if(page === 1){
            return <NFTMixer formData = {formData} setFormData = {setFormData} ffmpeg = {ffmpeg} fetchFile = {fetchFile}/>;
        }
        else if(page === 2){
            return <NFTMinter formData = {formData} setFormData = {setFormData}/>;
        }
    }

    const load = async() => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        if(!user) return null;

        setAddress(user.get('ethAddress'));

        if(!ffmpeg.isLoaded()){
            load();
        }
        else{
            setReady(true);
        }
    }, [user]);


    return (
                <Container>
                    <Row className='p-5 d-flex justify-content-center'>
                        {ready?(
                            
                            <Card bg="dark-2" 
                                  className="shadow animate__animated animate__fadeInUp align-items-center" 
                                  style={{ width: '50rem', height: '35rem', borderRadius:'1rem' }}>

                                    <Card.Body>
                                    {/* Card Header */}
                                        
                                        {/*<ProgressBar animated 
                                                     variant="secondary" 
                                        now={page === 0 ? 1 : page === 1 ? 25 : page === 2 ? 50 : page === 3 ? 75 : 100}/> */}
                                        
                                        <Row className="justify-content-center text-light-3">
                                            <h4>{FormTitles[page]}</h4>
                                        </Row>
                                    {/* Card Body */}
                                        
                                        <Row className="my-auto">
                                            {PageDisplay()}
                                        </Row>
        
                                    </Card.Body>
                                    {/* Card Footer */}
                                    <Card.Footer>
                                    <Row className='mt-auto justify-content-between'>
                                            <Col xs={6}>
                                                <Button variant='light-3' 
                                                        onClick={() => {setPage((currPage) => currPage - 1)}}
                                                        disabled={page == 0}> Back </Button>
                                            </Col>
                                            { page === 0 &&
                                                <Col className=''xs={6}>
                                                    <Button variant='light-3' 
                                                        onClick={() => {setPage((currPage) => currPage + 1)}}
                                                        disabled={page == FormTitles.length - 1}> Mix NFTYTune </Button>
                                                </Col>
                                            }
                                            { page === 1 &&
                                                <Col className=''xs={6}>
                                                    <Button variant='light-3' 
                                                        onClick={() => {setPage((currPage) => currPage + 1)}}
                                                        disabled={page == FormTitles.length - 1}> Looks Great! </Button>
                                                </Col>
                                            }
                                            { page === 2 &&
                                                <Col className=''xs={6}>
                                                    <Button variant='light-3' 
                                                        onClick={() => {setPage((currPage) => currPage + 1)}}
                                                        disabled={page == FormTitles.length - 1}> Lets Mint! </Button>
                                                </Col>
                                            }
                                    </Row>
                                    </Card.Footer>
                                
                            </Card>
                        )
                        :(
                            <></>
                        )}
                    </Row>
                </Container>
    )
}

export default MultiStepForm