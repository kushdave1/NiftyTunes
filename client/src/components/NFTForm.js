import React, {useState, useEffect} from 'react'
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

import {useDropzone} from 'react-dropzone'

import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'


import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'

import styled from 'styled-components'

import ReactPlayer from 'react-player'
import Moralis from 'moralis'

const ffmpeg = createFFmpeg({log: true});

const getColor = (props)=> {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    return '#eeeeee';
}

const FileZone = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-style: dashed;
  background-color: ${props => getColor(props)};
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const VideoContainer = styled(Container)`
    display: flex;
    justify-content: center;
    width:100%;
    background-color: #000000;
`;



function NFTForm() {
    document.body.style.overflow = "hidden";

    /*file states*/
    const [audioFile, setAudioFile] = useState();
    const [videoFile, setVideoFile] = useState()    
    const [ready, setReady] = useState(false);
    const [gif, setGif] = useState();
    const [resultFile, setResultFile] = useState();
    const [mixMessage, setMixMessage] = useState('');
    const [mintErrMessage, setMintErrMessage] = useState('');
    const [isMixing, setIsMixing] = useState(false);
    const [mintProgress, setMintProgress] = useState();
    const [mintSuccessMsg, setMintSuccessMsg] = useState('')
    const [mintProgressLabel, setMintProgressLabel] = useState('')
    /* form states */
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [supply, setSupply] = useState();
    const [blockchain, setBlockchain] = useState();

    /* modal state */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {error, isUploading, saveFile, moralisFile} = useMoralisFile();
    const {isAuthenticated, user} = useMoralis();

    const [address, setAddress] = useState();

    const {lazyMint} = useRaribleLazyMint({
            chain: 'eth',
            userAddress: address,
            tokenType: 'ERC721', 
            supply: 1, 
            royaltiesAmount: 5
     });


    

    const load = async() => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        if(!user) return null;
        setAddress(user.get('ethAddress'))
        load();
    }, [user]);


    

    const convertToGif = async() => {
        setGif(null);
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
        
                video.src = window.URL.createObjectURL(file);
            } catch (e) {
                reject(e);
            }
        });

        if(!videoFile || !audioFile){
            setMixMessage('Please select an audio and video file to mix!');
        }
        else if(await videoFile.type.includes('image')){
            //if input is an image
            setMixMessage('');
            setIsMixing(true);

            console.log(videoFile.type);
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
            await setGif(url);
            setIsMixing(false);
        }
        else if(await videoFile.type.includes('video')){
            //if file is a video
            setMixMessage('');
        
            //write the file to memory
            setIsMixing(true);
            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoFile));
            ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(audioFile));

            const videoDuration = await loadVideo(videoFile);
            const audioDuration = await loadVideo(audioFile);

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
            await setGif(url)
            setIsMixing(false)
        }

    }

    const handleSaveIPFS = async (file) => {
        
        if(!name || !description){
            setMintErrMessage('Please enter a name and description to mint.');
        }
        else{
            setMintErrMessage('');

        setMintProgress(10)
        setMintProgressLabel('Saving Content to IPFS')
        const arr = new Moralis.File("video.mp4", Array.from(resultFile))
        const gifIPFS = await arr.saveIPFS();

        if(gifIPFS){
            setMintProgress(30)
            setMintProgressLabel('Uploading Metadata')
            let gifHash = gifIPFS._hash;

            console.log(gifIPFS._hash);
            console.log(gifIPFS._ipfs);
    
            //Create metadata with video hash & data
            const metadata = {
                name: name,
                description: description,
                image: '/ipfs/' + gifHash
            };
    
            console.log(metadata);
    
            //save metadata file and upload to rarible
            const metadataFileIPFS = await saveFile('metadata.json', {
                base64: btoa(JSON.stringify(metadata))
            }, {
                saveIPFS:true, 
                onSuccess: async (metadataFile) => {
                    console.log(metadataFile);
                    setMintProgress(60)
                    setMintProgressLabel('Awaiting Signature')
                    await Moralis.enableWeb3();
                    await lazyMint({
                        params:{
                            tokenUri: 'ipfs://' + metadataFile._hash
                        }, 
                        onSuccess: (res) => {
                            console.log(res)
                            setMintProgress(100)
                            setMintProgressLabel('Done!')
                            setMintSuccessMsg(`https://rarible.com/token/${res.data.result.tokenAddress}:${res.data.result.tokenId}`)
                            setMintProgress(null)
                            setMintProgressLabel(null)
                        }
                    })
                }
            }); 
        }
  //console.log(gifIPFS)
    }



    }


    const handleMix = (e) => {
        e.preventDefault();

        convertToGif();

        handleShow();
        /*handleSaveIPFS(audioFile);*/

    }

    const handleNext = (e) => {
        e.preventDefault();
        handleSaveIPFS(resultFile)
    }

   

    return ready?(

      <Container>
            <Row>
                    <div className='d-flex justify-content-center'>
                    <Card className="shadow-lg" style={{ width: '45rem', height: '35rem', borderRadius:'1rem' }}>
                        <Card.Body className ="p-5">
                            <h2 class="fw-bold mb-0">Create an original NFT</h2>
                            <small class="mb-5 fw-bold text-primary">in 3 easy steps</small>
                                      <Form onSubmit={handleMix} className='my-5'>
                                      <Stack gap={4}>
                                        <Row>
                                            <Col xs={1}>
                                                <i class="bi bi-camera-video-fill" style={{fontSize: "2rem", color: '#FF3998'}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                 <h4 className="text-start fw-bold mb-0">Upload your tripiest <span class="text-primary">visual</span></h4>
                                                 <small className='text-muted'>Any video or image file works!</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                 <FormGroup controlId = "uploadVideoFile">
                                                    <Form.Control 
                                                         type="file" 
                                                         placeholder="Upload File" 
                                                         onChange={(e) => setVideoFile(e.target.files?.item(0))}
                                                     />
                                                </FormGroup>
                                            </Col>
                                            </Row>
                                        
                                        

                                        <Row>
                                            <Col xs={1}>
                                                <i class="bi bi-boombox" style={{fontSize: "2rem", color: "#FCA17D"}}></i>
                                            </Col>
                                            <Col className="align-self-center">
                                                <div>
                                                    <h4 className="text-start fw-bold mb-0">Upload an absolute <span class="text-secondary">chune</span></h4>
                                                    <small className='text-muted'>Make sure you own this shit...</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup controlId = "uploadAudioFile">
                                                    <Form.Control 
                                                        type="file" 
                                                        placeholder="Upload File" 
                                                        onChange={(e) => setAudioFile(e.target.files?.item(0))}
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
                                                    <h4 className="text-start fw-bold mb-0">Create something <span className='text-success'>unique</span></h4>
                                                    <small className='text-muted'>View and mint your new NFT on Rarible. No gas fees! Lucky You.</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <Button className='mb-2 w-100' size='lg' variant="outline-success" type="submit">
                                                    Mix Your Tune
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
                                                <i class="bi bi-bag-check-fill"></i>
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
                    
                    {gif && 
                        <Modal show={show} onHide={handleClose} contentClassName = 'modal-rounded-3' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' backdrop="static" keyboard={false} >
                        <Modal.Body>

                        <h2 className='text-start fw-bold py-3 mb-3'>Done, let's take a look!</h2>
                        <Row className='mb-3'>
                            <Col>
                                <div className='d-flex justify-content-center'>
                                     <video
                                        className="rounded shadow mb-5"
                                        controls
                                        width="400"
                                        src={gif}
                                        loop={true}
                                        autoPlay
                                        muted>
                                    </video>
                                </div>
                            </Col>
                            <div className='d-flex justify-content-center mt-0'>
                                <small className='text-muted'>Make sure to turn the sound all the way up!</small>
                            </div>
                        </Row>
                        <Row className='mb-5'>
                            <Col>
                            <div className='d-flex justify-content-center mb-5 '>
                                <Button variant="dark" className = 'w-75' onClick={handleClose}>
                                    Meh, lemme try that again
                                </Button>
                            </div>
                            </Col>

                            <div className='d-flex justify-content-center'>
                                <small className='fw-bold'>Or</small>
                            </div>
                        </Row>
                        <Row>
                            <h2 className='text-start fw-bold py-3 mb-3'>Glad you like it! Let's add some details. </h2>
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
                           </Form>
                           </Col>
                        </Row>
                        <Row>
                            <div className='d-flex justify-content-center mt-1 mb-5'>
                                <Button variant="outline-primary" className = 'w-75' onClick={handleNext}>
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
                               {' '} Congrats! Your NFT has been minted. View and Sell in 
                                <Alert.Link href={mintSuccessMsg}> Rarible</Alert.Link>
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
                           {/*NFT metadata end */}
                        </Modal.Body>
                      </Modal>
                    }
            </Row>
            </Container> 
    ): (
         
        <Container fluid>
            <Row>
                <div className='d-flex justify-content-center'>
                    <h4 className = 'text-primary' style={{fontWeight:"700"}}>Loading Packages...</h4>
                </div>
            </Row>
            <Row>
                <div className='d-flex justify-content-center'>
                 <Spinner as='span' animation="border" variant='primary'/>
                </div>
            </Row>
        </Container>
    
    );
}

export default NFTForm
