import React, {useState} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'

function NFTForm() {

    const [pillActive, setPillActive] = useState('videoTab');

    const handlePillClick = (value) => {
        setPillActive(value);
    }


    

    return (
        <Container className = "h-100">
            <Row className = "justify-content-md-center my-5">
            </Row>


            <Row className="p-3">
                <Col sm={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title> Create NFT</Card.Title>
                                        {/* Nav Switch */}
                                        <Nav 
                                            variant="pills dark justify-content-center my-5" 
                                            defaultActiveKey="videoTab"
                                            onSelect={(selectedKey) => handlePillClick(selectedKey)} >
                                        <Nav.Item>
                                            <Nav.Link eventKey="videoTab">Video</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="musicTab">Music</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="mixedTab">Mixed</Nav.Link>
                                        </Nav.Item>
                                        </Nav>
                                         {/* End Nav Switch */}

                                      {/* Form */
                                        console.log(pillActive)
                                      }

                                      <Form>
                                        {(pillActive == 'videoTab') && 
                                            <Form.Group className="mb-3" controlId="formFile">
                                            <Form.Label>Upload Video File</Form.Label>
                                            <Form.Control type="file" placeholder="Upload File" multiple/>
                                            </Form.Group>
                                        }

                                        {(pillActive == 'musicTab') &&
                                             <Form.Group className="mb-3" controlId="formFile">
                                             <Form.Label>Upload Audio File</Form.Label>
                                             <Form.Control type="file" placeholder="Upload File" multiple/>
                                             </Form.Group>
                                        }

                                        {(pillActive == 'mixedTab') &&
                                            <Form.Group className="mb-3" controlId="formFile">
                                            <Form.Label>Upload Video File</Form.Label>
                                            <Form.Control type="file" placeholder="Upload File" multiple/>
                                            <Form.Label>Upload Audio File</Form.Label>
                                            <Form.Control type="file" placeholder="Upload File" multiple/>
                                            </Form.Group>
                                        }

                                        <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Item Name</Form.Label>
                                        <Form.Control type="input" placeholder="Enter name" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formExternalLink">
                                        <Form.Label>External Link</Form.Label>
                                        <Form.Control type="input" placeholder="Enter link" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlDescription">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} />
                                        </Form.Group>

                                        <Form.Select aria-label="Default select example">
                                            <option>Collection</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>

                                        <Form.Label>Supply</Form.Label>
                                        <Form.Range />

                                        <Form.Select aria-label="Default select example">
                                            <option>BlockChain</option>
                                            <option value="1">Ethereum</option>
                                            <option value="2">Polygon</option>
                                        </Form.Select>

                                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="Freeze metadata" />
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