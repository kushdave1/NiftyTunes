//React
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
import InputGroup from 'react-bootstrap/InputGroup'

//APIs
import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import Moralis from 'moralis'

//Components
import NFTModalNfty from './NFTModalNfty'

function MadeNFTForm(props) {
    document.body.style.overflow = "hidden";

    let ffmpeg = props.ffmpeg;
    let address = props.address;

     /* mint states */
     const [mintProgressLabel, setMintProgressLabel] = useState('');
     const [mintProgress, setMintProgress] = useState();

     /*file states*/
     const [singleFile, setSingleFile] = useState();
     const [output, setOutput] = useState();
     const [resultFile, setResultFile] = useState();
     const [fileType, setFileType] = useState('');

     /* render states */
     const [renderMessage, setRenderMessage] = useState('');
     const [isRender, setIsRender] = useState(false);


    /* modal state */
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const toggleShow = () => setShow(p => !p);

    const {saveFile} = useMoralisFile();

    const renderInput = async() => {
        setOutput(null);
        setMintProgress(null);
        setMintProgressLabel('');
        setFileType('');

        if(!singleFile){
            setRenderMessage('Please select a file!');
        }
        else if(await singleFile.type.includes('image')){
            //if file is an image
            setRenderMessage('');
            setIsRender(true);
            setFileType('img');

            await setResultFile(singleFile);
            console.log(resultFile);
            //create url
            const url = URL.createObjectURL(singleFile, {type: 'image/png'});
            await setOutput(url);
            setIsRender(false);
        }
        else if(await singleFile.type.includes('video')){
            //if file is a video
            setRenderMessage('');
            setIsRender(true);
            setFileType('video')

            await setResultFile(singleFile);

            //create url
            const url = URL.createObjectURL(singleFile, {type: 'video/mp4'});
            await setOutput(url);
            setIsRender(false);
        }
        else if(await singleFile.type.includes('audio')){
            //if file is a video
            setRenderMessage(`Audio files are unsupported (Rarible's fault)`);
        }
        else{
            setRenderMessage('File type unsupported.');
        }

    }


    const handleRender = (e) => {
        e.preventDefault();
        renderInput();
        handleShow();
    }

  return (
        <Container>
            <Row>
                    <div className='d-flex justify-content-center'>
                    <Card className="shadow-lg animate__animated animate__fadeInUp" style={{ width: '45rem', height: '35rem', borderRadius:'1rem' }}>
                        <Card.Body className ="p-5">
                            <h2 className="fw-bold mb-0">Create an original NFTYTUNE</h2>
                            <small class="mb-5 fw-bold text-primary">in 2 easy steps</small>
                                      <Form onSubmit={handleRender} className='my-5'>
                                      <Stack gap={4}>
                                        <Row>
                                            <Col xs={1}>
                                                <i class="bi bi-camera-video-fill" style={{fontSize: "2rem", color: '#FF3998'}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                 <h4 className="text-start fw-bold mb-0">Upload your original <span class="text-primary">masterpiece</span></h4>
                                                 <small className='text-muted'>Any video or image file works! (audio file support coming soon)</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                 <FormGroup controlId = "uploadVideoFile">
                                                    <Form.Control 
                                                         type="file" 
                                                         placeholder="Upload File" 
                                                         onChange={(e) => setSingleFile(e.target.files?.item(0))}
                                                     />
                                                </FormGroup>
                                            </Col>
                                            </Row>
                                        
                                    
                                        <Row>
                                            <Col xs={1}>
                                                <i class="bi bi-stars" style={{fontSize: "2rem", color: "#39FFA0"}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                    <h4 className="text-start fw-bold mb-0">Mint it for the <span className='text-success'>children</span></h4>
                                                    <small className='text-muted'>View and mint your new NFT on Rarible. No gas fees! Lucky You.</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <Button className='mb-2 w-100 fw-bold' size='lg' variant="outline-success" type="submit">
                                                    Mint on NftyTunes
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                        {renderMessage &&
                                            <Alert variant='danger'>
                                                <i class="bi bi-radioactive"></i>
                                                {'  '}{renderMessage}    
                                             </Alert>
                                        }
                                         {isRender &&
                                             <Alert variant='dark'>
                                                <i class="bi-check-circle-fill"></i>
                                                {'  '}<strong> Hang Tight</strong>, we're building the NFT as we speak 
                                               {'   '} <Spinner as='span' size='sm' animation="border" variant='dark'/>
                                            </Alert>
                                        }
                                        </Row>
                                        </Stack>
                                        
                                     </Form>
                                    
                        </Card.Body>
                    </Card> 
                </div>
                {output &&
                    <NFTModalNfty 
                        show = {show}
                        setShow = {setShow} 
                        toggleShow = {toggleShow}
                        output={output} 
                        resultFile = {resultFile}
                        fileType = {fileType}
                        userAddress = {props.address}
                        mintProgress = {mintProgress}
                        mintProgressLabel = {mintProgressLabel}
                        setMintProgress = {setMintProgress}
                        setMintProgressLabel = {setMintProgressLabel} />
                }
            </Row>
        </Container>
  )
}

export default MadeNFTForm