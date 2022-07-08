//React
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//components 
import NFTModalNfty from './NFTModalNfty'
import Board from '../nftyDraggable/board'

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

//APIs
import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import Moralis from 'moralis'




function NFTForm (props) {
    document.body.style.overflow = "hidden";

    let ffmpeg = props.ffmpeg;
    let address = props.address;

    /*file states*/
    const [audioFile, setAudioFile] = useState('');
    const [videoFile, setVideoFile] = useState('');    
    const [audioTokenId, setAudioTokenId] = useState('');
    const [videoTokenId, setVideoTokenId] = useState('');
    const [audioTokenAddress, setAudioTokenAddress] = useState('');
    const [videoTokenAddress, setVideoTokenAddress] = useState('');
    const [output, setOutput] = useState();
    const [resultFile, setResultFile] = useState();
    const [mixMessage, setMixMessage] = useState('');
    const [mintErrMessage, setMintErrMessage] = useState('');
    const [isMixing, setIsMixing] = useState(false);
    const [mintProgress, setMintProgress] = useState();
    const [mintSuccessMsg, setMintSuccessMsg] = useState('')
    const [mintProgressLabel, setMintProgressLabel] = useState('')
    const [fileType, setFileType] = useState('');

    /* form states */
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [royalties, setRoyalties] = useState('');
    const [supply, setSupply] = useState(1);

    /* modal state */
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const toggleShow = () => setShow(p => !p);

    const {saveFile} = useMoralisFile();


    const {lazyMint} = useRaribleLazyMint({
            chain: 'eth',
            userAddress: address,
            tokenType: 'ERC721', 
            supply: 1, //parseInt(supply) 
            royaltiesAmount: parseInt(royalties) * 100
     });



    

    const convertToGif = async() => {
        setOutput(null);
        setMintProgress(null);
        setMintProgressLabel('');

        const loadVideo = file => new Promise((resolve, reject) => {
            try {
                let video = document.createElement('video');
                video.preload = 'metadata';
        
                video.onloadedmetadata = function () {
                    resolve(this);
                }
        
                video.onerror = function () {
                    reject("Please select a valid video file.");
                }
                // video.src = window.URL.createObjectURL(file);
                video.src = window.URL.createObjectURL(new Blob([file.buffer], {type: 'video/mp4'}));
            } catch (e) {
                reject(e);
            }
        });

        const url = new URL(videoFile);
        ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoFile));
        const fileOne = ffmpeg.FS('readFile', 'video.mp4')
        const videoDurations = await loadVideo(fileOne);
        let videoDurs = await videoDurations.duration;
        const videoDurationFinal = parseFloat(videoDurs)

        if(!videoFile || !audioFile){
            setMixMessage('Please select an audio and video file to mix!');
        }
        else if(videoDurationFinal === 0){
            //if input is an image
            setMixMessage('');
            setIsMixing(true);

            ffmpeg.FS('writeFile', 'video.png', await fetchFile(videoFile));
            ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(audioFile));
            
            const audioDuration = await loadVideo(audioFile);
            const audioDur = await audioDuration.duration;
            const audioDurSecond = audioDur-0.25;
            const fadeIn = "afade=t=in:st=0:d=0.25,afade=t=out:st="+`${audioDurSecond}`+":d=0.25";

            await ffmpeg.run('-i', 'audio.wav', '-af', `${fadeIn}`, 'audio1.wav')

            await ffmpeg.run('-framerate', '1/10', '-i', 'video.png', '-c:v', 'libx264', '-t', `${audioDur}`, '-pix_fmt', 'yuv420p', '-vf', 'scale=4000:4000', 'output.mp4');
            await ffmpeg.run('-i', 'output.mp4', '-i', 'audio1.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');
            const data = ffmpeg.FS('readFile', 'out.mp4');

            await setResultFile(data);

            //create url
            const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
            await setOutput(url);
            await setFileType('video')
            setIsMixing(false);
        }
        else if(videoDurs !== 0){
            //if file is a video
            setMixMessage('');
        
            //write the file to memory
            setIsMixing(true);
            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoFile));
            ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(audioFile));

            // const videoDuration = await loadVideo(videoFile);
            // const audioDuration = await loadVideo(audioFile);

            const fileVideo = ffmpeg.FS('readFile', 'video.mp4')
            const videoDuration = await loadVideo(fileVideo);

            const fileAudio = ffmpeg.FS('readFile', 'audio.wav')
            const audioDuration = await loadVideo(fileAudio)

            const videoDur = await videoDuration.duration;
            const audioDur = await audioDuration.duration;

            const audioDurSecond = audioDur-0.25;

            const mult = 1/(videoDur/audioDur);
            
            const setDuration = "setpts="+`${mult}`+"*PTS"

            await ffmpeg.run('-i', 'video.mp4', '-filter:v', `${setDuration}`, 'output.mp4')

            const fadeIn = "afade=t=in:st=0:d=0.25,afade=t=out:st="+`${audioDurSecond}`+":d=0.25";

            await ffmpeg.run('-i', 'audio.wav', '-af', `${fadeIn}`, 'audio1.wav')

            // //run ffmpeg command
            await ffmpeg.run('-i', 'output.mp4', '-i', 'audio1.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');

            const data = ffmpeg.FS('readFile', 'out.mp4')

        

            const rf = new Blob([data.buffer], {type: 'video/mp4'});

        
            await setResultFile(data)

            //create a URL
            const url = URL.createObjectURL(rf);
            await setOutput(url)
            await setFileType('video')
            setIsMixing(false)
        }

    }

    const handleMix = (e) => {
        e.preventDefault();
        convertToGif();
        handleShow();

    }

    return(

      <Container>
            <Row>
                    <div className='d-flex justify-content-center'>
                    <Card className="shadow-lg animate__animated animate__fadeInUp rounded" style={{ width: '45rem', height: '80rem', borderRadius:'1rem' }}>
                        <Card.Body className ="p-5">
                            <h2 className="fw-bold mb-0">Build a NFTYTUNE from scratch</h2>
                            <small className="mb-5 fw-bold text-primary">in 3 easy steps</small>
                                      <Form onSubmit={handleMix} className='my-5'>
                                      <Stack gap={4}>
                                        <Row>
                                            <Col xs={1} className="align-self-center">
                                                <i className="bi bi-camera-video-fill" style={{fontSize: "2rem", color: '#FF3998'}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                 <h4 className="text-start fw-bold mb-0">Upload your trippiest <span className="text-primary">visual</span></h4>
                                                 <small className='text-muted'>Any video or image file works!</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                 {/* <FormGroup controlId = "uploadVideoFile">
                                                    <Form.Control 
                                                         type="file" 
                                                         placeholder="Upload File" 
                                                         onChange={(e) => setVideoFile(e.target.files?.item(0))}
                                                     />
                                                </FormGroup> */}
                                                <Board><div 
                                                onDrop={(e) => {setVideoFile(document.getElementById(e.dataTransfer.getData('card_id')).firstChild.firstChild.src);
                                                                setVideoTokenId(document.getElementById(e.dataTransfer.getData('card_id')).firstChild.tokenId);
                                                                setVideoTokenAddress(document.getElementById(e.dataTransfer.getData('card_id')).firstChild.tokenAddress);} }
                                                style={{padding:"10px", height: 400, width: 280, border: "1px dotted black", overflow: "hidden"}}></div>
                                                </Board>
                                            </Col>
                                            </Row>
                                        
                                        

                                        <Row>
                                            <Col xs={1} className="align-self-center">
                                                <i className="bi bi-boombox" style={{fontSize: "2rem", color: "#8A97B3"}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                    <h4 className="text-start fw-bold mb-0">Upload an absolute <span className="text-secondary">chune</span></h4>
                                                    <small className='text-muted'>We'll merge and loop this over your file.</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                {/* <FormGroup controlId = "uploadAudioFile">
                                                    <Form.Control 
                                                        type="file" 
                                                        placeholder="Upload File" 
                                                        onChange={(e) => setAudioFile(e.target.files?.item(0))}
                                                    />
                                                </FormGroup> */}
                                                <Board><div 
                                                onDrop={(e) => {setAudioFile(document.getElementById(e.dataTransfer.getData('card_id')).firstChild.firstChild.src);
                                                                setAudioTokenId(document.getElementById(e.dataTransfer.getData('card_id')).firstChild.tokenId);
                                                                setAudioTokenAddress(document.getElementById(e.dataTransfer.getData('card_id')).firstChild.tokenAddress);} }
                                                style={{padding:"10px", height: 400, width: 280, border: "1px dotted black", overflow: "hidden"}}></div>
                                                </Board>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={1}>
                                                <i className="bi bi-stars" style={{fontSize: "2rem", color: "#39FFA0"}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                    <h4 className="text-start fw-bold mb-0">Create something <span className='text-success'>unique</span></h4>
                                                    <small className='text-muted'>View and mint your new NFT on Rarible. No gas fees! Lucky You.</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <Button className='mb-2 w-100 fw-bold' size='lg' variant="outline-success" type="submit">
                                                    Make NFTYTUNE
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                        {mixMessage &&
                                            <Alert variant='danger'>
                                                <i class="bi bi-radioactive"></i>
                                                {'  '}{mixMessage}    
                                             </Alert>
                                        }
                                         {isMixing &&
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
                                setMintProgressLabel = {setMintProgressLabel}
                                audioTokenAddress = {audioTokenAddress}
                                audioTokenId = {audioTokenId} 
                                videoTokenAddress = {videoTokenAddress}
                                videoTokenId = {videoTokenId}/>
                    }
            </Row>
            </Container> 
    )
}

export default NFTForm
