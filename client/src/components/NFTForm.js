import React, {useState, useRef, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
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

import Axios from 'axios'

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
    background-color: #bdbdbd;
`;



function NFTForm() {

    /*file states*/
    const [audioFile, setAudioFile] = useState();
    const [videoFile, setVideoFile] = useState()    
    const [ready, setReady] = useState(false);
    const [gif, setGif] = useState();
    const [resultFile, setResultFile] = useState();
    const [uploadedFile, setUploadedFile] = useState({});
    const [mixMessage, setMixMessage] = useState('');
    const [mintErrMessage, setMintErrMessage] = useState('');
    const [isMixing, setIsMixing] = useState(false);
    const [mintProgress, setMintProgress] = useState();
    const [mintSuccessMsg, setMintSuccessMsg] = useState('')
    const [mintProgressLabel, setMintProgressLabel] = useState('')
    /* form states */
    const [name, setName] = useState('');
    const [link, setLink] = useState();
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
            chain: 'rinkeby',
            userAddress: address,
            tokenType: 'ERC1155', 
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

            await ffmpeg.run('-framerate', '1/10', '-i', 'video.png', '-c:v', 'libx264', '-t', `${audioDur}`, '-pix_fmt', 'yuv420p', '-vf', 'scale=4000:4000', 'output.mp4');
            await ffmpeg.run('-i', 'output.mp4', '-i', 'audio.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');
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

            const mult = 1/(videoDur/audioDur);
            
            const setDuration = "setpts="+`${mult}`+"*PTS"

            await ffmpeg.run('-i', 'video.mp4', '-filter:v', `${setDuration}`, 'output.mp4')

            // //run ffmpeg command
            await ffmpeg.run('-i', 'output.mp4', '-i', 'audio.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');

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
                            setMintSuccessMsg(`https://rinkeby.rarible.com/token/${res.data.result.tokenAddress}:${res.data.result.tokenId}`)
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

      <Container className = "h-100">
            <Row>

            </Row>
            <Row className="p-2">
                <Col lg>
                    <Card className="shadow-lg rounded">
                       
                        <Card.Body>

                                      <Form onSubmit={handleMix}>
                                      <Row className="mb-3">
                                        <FormGroup as= {Col} controlId = "uploadVideoFile">
                                        <Form.Label>Upload Video File</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                placeholder="Upload File" 
                                                onChange={(e) => setVideoFile(e.target.files?.item(0))}
                                            />
                                        </FormGroup>
                                        <FormGroup as={Col} controlId = "uploadAudioFile">
                                            <Form.Label>Upload Audio File</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                placeholder="Upload File" 
                                                onChange={(e) => setAudioFile(e.target.files?.item(0))}
                                            />
                                         </FormGroup>
                                        </Row>
                                            <Button variant="primary" type="submit">
                                                Mix
                                            </Button>
                                     </Form>
                                    
                                    
                        </Card.Body>
                    </Card> 
                    {mixMessage &&
                        <Alert variant='danger'>
                        {mixMessage}
                      </Alert>
                    }
                    {isMixing &&
                        <Stack gap={2} className="col-lg-5 mx-auto mt-5">
                                <h4 className = 'text-light'>Crafting your NFT (This may take a moment)</h4>
                                <Spinner as='span' animation="border" variant='light'/>
                       </Stack>
                        
                    
                    }
                    {gif && 
                        <Modal show={show} onHide={handleClose} className="modal-fullscreen" backdrop="static" keyboard={false}>
                        
                        <Modal.Body>
                        <Row>
                            <small className="display-5 text-center">Preview NFT</small>
                            <Col>
                                <VideoContainer className="border border-primary border-5 rounded">
                                    <ReactPlayer
                                        controls
                                        url={gif}
                                        height='400px'
                                        style={{width:'100%'}}
                                        muted={true}
                                        loop={true}
                                        playing={true}>
                                    </ReactPlayer>
                                </VideoContainer>
                            </Col>
                        </Row>
                        <Row>
                            <small className="display-5 text-center"> Add metadata</small>
                            <Col>
                             {/* NFT metadata */}
                           <Form>
                               {/* Name */}
                            <Form.Group className="mb-3" controlId="nft.Name">
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="NFT Name"
                                    className="mb-3"
                                >
                                <Form.Control 
                                    type="input"
                                    onChange={e => setName(e.target.value)}/>
                                </FloatingLabel>
                            </Form.Group>

                             {/* Description */}
                            <Form.Group className="mb-3" controlId="nft.Desc">
                                 <FloatingLabel controlId="floatingInput" label="NFT Description">
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        onChange={e => setDescription(e.target.value)}/>
                                </FloatingLabel>
                            </Form.Group>
                           </Form>
                           </Col>
                        </Row>
                            {mintErrMessage &&
                                <Alert variant='danger'>
                                {mintErrMessage}
                                </Alert>
                            }
                            {mintSuccessMsg &&
                                <Alert variant='success'>
                                Congrats! You're NFT has been minted. View and Sell in 
                                <Alert.Link href={mintSuccessMsg}>Rarible</Alert.Link>
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
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={handleNext}>
                            Lazy Mint !
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    }
            </Col>
            </Row>
            </Container> 
    ): (
        
        <Container fluid>
            <Row>
                <h4 className = 'text-primary' style={{fontWeight:"700"}}>Loading Packages...</h4>
            </Row>
            <Row>
                <Col>
                 <Spinner as='span' animation="border" variant='primary'/>
                </Col>
            </Row>
        </Container>
    
    );
}

export default NFTForm
