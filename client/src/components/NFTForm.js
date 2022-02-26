import React, {useState, useRef, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'

import {useDropzone} from 'react-dropzone'

import {useMoralis, useMoralisFile} from 'react-moralis'

import APIService from '../services/APIService'

import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({log: true});

function NFTForm() {

    const [audioFile, setAudioFile] = useState();
    const [videoFile, setVideoFile] = useState()    
    const [ready, setReady] = useState(false);
    const [gif, setGif] = useState();
    const {error, isUploading, saveFile, moralisFile} = useMoralisFile();

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

        //create a URL
        const url = URL.createObjectURL(new Blob([data.buffer], {type:'video/mp4'}));
        setGif(url)
    }  
    const handleSaveIPFS = async (f) => {

        console.log(f);

        let audiofileIPFS = await saveFile(audioFile.name, audioFile, {saveIPFS: true});
        let videofileIPFS = await saveFile(videoFile.name, videoFile, {saveIPFS: true});

        console.log(audiofileIPFS._ipfs)
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        convertToGif();
        /*handleSaveIPFS(audioFile);*/

    } 

    


    

    return ready?(
        
        <Container className = "h-100">
            <Row className="p-2">
                <Col lg>
                    <Card className="shadow-lg rounded">
                       
                        <Card.Body>

                                      <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3" controlId="formFile">
                                            <Form.Label>Upload Video File</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                placeholder="Upload File" 
                                                onChange={(e) => setVideoFile(e.target.files?.item(0))}
                                            />
                                            <Form.Label>Upload Audio File</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                placeholder="Upload File" 
                                                onChange={(e) => setAudioFile(e.target.files?.item(0))}
                                            />
                                            </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Mint
                                        </Button>
                                     </Form>
                                    
                                      {/* End Form */}
                        </Card.Body>
                    </Card>

                    {gif && <video
                       controls
                       width="250"
                       src={gif}>
                    </video>}
                </Col>
        </Row>
    </Container>
    ): (<p>Loading...</p>);
}

export default NFTForm
