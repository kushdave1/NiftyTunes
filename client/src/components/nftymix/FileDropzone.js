//React
import React, {useRef, useState} from 'react'
import styled from 'styled-components'

//Bootstrap
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/FormGroup'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const FileSection = styled.div``;

const FileUploader = styled.div``;
function FileDropzone({formData, setFormData}) {

  const [isAudioFileInput, setIsAudioFileInput] = useState(false);
  const [isVisualFileInput, setIsVisualFileInput] = useState(false);

  const hiddenVisualInput = useRef(null);
  const hiddenAudioInput = useRef(null);

  const handleVisualClick = event => {
      hiddenVisualInput.current.click();
  }

  const handleVisualChange = async (event) => {
      const fileUploaded = event.target.files[0];
      await setFormData({...formData, visualFile: fileUploaded});
      setIsVisualFileInput(true)
  }

  const handleAudioClick = event => {
    hiddenAudioInput.current.click();
  }

  const handleAudioChange = async (event) => {
    const fileUploaded = event.target.files[0];
    await setFormData({...formData, audioFile: fileUploaded});
    setIsAudioFileInput(true)
  }

  let CardVisualBgClass = isVisualFileInput ? "success" : "dark-3";
  let CardAudioBgClass = isAudioFileInput? "success" : "dark-3";
  let CardVisualIconClass = isVisualFileInput ? "bi bi-check-circle" : "bi bi-camera-video-fill";
  let CardAudioIconClass = isAudioFileInput ? "bi bi-check-circle" : "bi bi-boombox"
  return (

    <FileSection>
        <Row className="my-5">
            <Col>
                <FormGroup controlId = "uploadVideoFile">
                    <Card bg={CardVisualBgClass} className='shadow'
                          className="align-items-center"
                          onClick = {handleVisualClick}
                          style={{ width: '10rem', height: '10rem', borderRadius:'1rem' }}
                    >
                        <Row className='my-auto'>
                            <i className={CardVisualIconClass} style={{fontSize: "5rem", color: '#CCCCCC'}}></i>
                        </Row>
                    </Card>
                
                <Form.Control 
                    type="file" 
                    placeholder="Upload File"
                    ref={hiddenVisualInput}
                    onChange={handleVisualChange}
                    style={{display:'none'}}
                />
            
                </FormGroup>
            </Col>
            <Col>
                <FormGroup controlId = "uploadAudioFile">
                    <Card bg={CardAudioBgClass} className='shadow'
                          className='align-items-center'
                          onClick = {handleAudioClick}
                          style={{ width: '10rem', height: '10rem', borderRadius:'1rem' }}
                    >
                        <Row className='my-auto'>
                            <i className={CardAudioIconClass} style={{fontSize: "5rem", color: "#CCCCCC" }}></i>
                        </Row>
                    </Card>
                
                <Form.Control 
                    type="file" 
                    placeholder="Upload File"
                    ref={hiddenAudioInput}
                    onChange={handleAudioChange}
                    style={{display:'none'}}
                />
                </FormGroup>
            </Col>
        </Row>
    </FileSection>
  )
}

export default FileDropzone