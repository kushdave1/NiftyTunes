//React
import React, {useRef} from 'react'
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
   
  const hiddenVisualInput = useRef(null);
  const hiddenAudioInput = useRef(null);

  const handleVisualClick = event => {
      hiddenVisualInput.current.click()
  }

  const handleVisualChange = event => {
      const fileUploaded = event.target.files?.item(0);
      setFormData({...formData, visualFile: fileUploaded});
  }

  const handleAudioClick = event => {
    hiddenAudioInput.current.click()
  }

  const handleAudioChange = event => {
    const fileUploaded = event.target.files?.item(0);
    setFormData({...formData, audioFile: fileUploaded});
  }

  return (
    <FileSection>
        <Row className="my-5">
            <Col>
                <FormGroup controlId = "uploadVideoFile">
                    <Card bg='primary'
                          className="align-items-center"
                          onClick = {handleVisualClick}
                          style={{ width: '10rem', height: '10rem', borderRadius:'1rem' }}
                    >
                        <Row className='my-auto'>
                            <i className="bi bi-camera-video-fill" style={{fontSize: "5rem", color: '#CCCCCC'}}></i>
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
                    <Card bg='secondary'
                          className='align-items-center'
                          onClick = {handleAudioClick}
                          style={{ width: '10rem', height: '10rem', borderRadius:'1rem' }}
                    >
                        <Row className='my-auto'>
                            <i className="bi bi-boombox" style={{fontSize: "5rem", color: "#CCCCCC" }}></i>
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