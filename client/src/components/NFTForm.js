import React, {useState, useRef, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import {useMoralis, useMoralisFile} from 'react-moralis'

import APIService from '../services/APIService'

function NFTForm() {

    const [pillActive, setPillActive] = useState('videoTab');
    


    const {error, isUploading, saveFile, moralisFile} = useMoralisFile();

    const [audioFile, setAudioFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null)

   

    const handlePillClick = (value) => {
        setPillActive(value);
    }

    const handleAudioFileChange = (event) =>{
        console.log(event.target.files);

        const file = event.target.files[0];
        setAudioFile(file);

        /*setUploadFile(file);

        console.log(uploadFile); */
    }

    const handleVideoFileChange = (event) => {
        console.log(event.target.files);

        const file = event.target.files[0];
        setVideoFile(file);
    }

    

    const handleSaveIPFS = async (f) => {

        console.log(f);

        let audiofileIPFS = await saveFile(audioFile.name, audioFile, {saveIPFS: true});
        let videofileIPFS = await saveFile(videoFile.name, videoFile, {saveIPFS: true})

        console.log(audiofileIPFS._ipfs)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        /*handleSaveIPFS(audioFile);*/

        const data = new FormData()
        data.append('audioFile', audioFile)
        data.append('videoFile', videoFile)

        fetch('http://localhost:5000/mix', {
            mode: 'no-cors',
            method: "POST",
            body: data,
          }).then((response) => {
            response.json().then((res) => {
              console.log(res);
            });
          });

    } 

    


    

    return (
        <Container className = "h-100">
            <Row className="p-2">
                <Col lg>
                    <Card className="shadow-lg rounded">
                        <Card.Body>
                                      {/* Form */}

                                      <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3" controlId="formFile">
                                            <Form.Label>Upload Video File</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                placeholder="Upload File" 
                                                onChange={handleVideoFileChange}
                                            />
                                            <Form.Label>Upload Audio File</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                placeholder="Upload File" 
                                                onChange={handleAudioFileChange}
                                            />
                                            </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Mint
                                        </Button>
                                     </Form>
                                    
                                      {/* End Form */}
                        </Card.Body>
                    </Card>
                </Col>
        </Row>
    </Container>
    )
}

export default NFTForm
