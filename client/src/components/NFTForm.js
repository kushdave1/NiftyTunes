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

import {useDropzone} from 'react-dropzone'

import {useRaribleLazyMint, useMoralis, useMoralisFile} from 'react-moralis'

import APIService from '../services/APIService'

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
    const [message, setMessage] = useState('');
    const [isMixing, setIsMixing] = useState(false)

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

    const {lazyMint} = useRaribleLazyMint({
            chain: 'rinkeby',
            userAddress: user.get('ethAddress'),
            tokenType: 'ERC1155', 
            supply: 1, 
            royaltiesAmount: 5
     });


    

    const load = async() => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        load();
    }, []);


    

    const convertToGif = async() => {
        //write the file to memory

        ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoFile));
        ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(audioFile));

        //run ffmpeg command
        await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');

        //read ffmpeg output
        const data = ffmpeg.FS('readFile', 'out.mp4')

        const rf = new Blob([data.buffer], {type: 'video/mp4'});

        
        await setResultFile(data)

        //create a URL
        const url = URL.createObjectURL(rf);
        await setGif(url)

    }  

    const handleSaveIPFS = async (file) => {

       //console.log(resultFile)

       //const data = new FormData();
       
        //data.append("video", file, 'result.mp4')

       /* for (var [key, value] of data.entries()) { 
            console.log(key, value);
           }*/
           
        //upload to express
        
        /*try{
            const res = await Axios.post('http://localhost:5000/upload', data, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { fileName, filePath} = res.data
            await setUploadedFile({fileName, filePath})
            console.log(uploadedFile);
        } catch(err){
            //
        }*/


        /*const response = await fetch('http://localhost:5000/upload', {
            method: 'POST', 
            body: data,
        })

        if(response){
            console.log(response)
        }
        else{
            console.log('file did not upload')
        }*/


        

        //upload to ipfs 

       //const gifFile = new Moralis.File("gifFile.mp4", {base64: resultFile});
        
        
        const arr = new Moralis.File("video.mp4", Array.from(resultFile))
        const gifIPFS = await arr.saveIPFS();
        
        /* let gifIPFS = await saveFile(arr._name, arr, {
            saveIPFS:true
        });*/

        console.log(gifIPFS)

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
                await Moralis.enableWeb3();
                await lazyMint({
                    params:{
                        tokenUri: '/ipfs/' + metadataFile._hash
                    }, 
                    onSuccess: (res) => {
                        console.log(res);
                    }
                })
            }
        }); 
       



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

                    {gif && 
                        <Modal show={show} onHide={handleClose} className="modal-fullscreen">
                        
                        <Modal.Body>
                        <Row>
                            <small className="display-5 text-center"> Preview NFT</small>
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
                          
                           {/*NFT metadata end */}
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={handleNext}>
                            Next
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    }
            </Col>
            </Row>
            </Container> 
    ): (
        
        <Spinner animation="grow" size="sm" variant="primary">  </Spinner>
    
    );
}

export default NFTForm
