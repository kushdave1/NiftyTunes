import React, {useState, useEffect} from 'react'

//custom components
import NFTPlayer from './NFTPlayer'

//bootstrap components
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import InputGroup from 'react-bootstrap/InputGroup'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

function AddMetadata({formData, setFormData}) {
  return (
    <Container>
       {/* Name */}
         <Form.Group className="mb-3" controlid="nft.Name">
             <FloatingLabel
                 controlid="floatingInput"
                 label="Name your masterpiece"
                 className="mb-3"
             >
             <Form.Control 
                 type="input"
                 placeholder= 'Name your masterpiece'
                 onChange={e => setFormData({...formData, nftName:e.target.value})}/>
             </FloatingLabel>
         </Form.Group>
          {/* Description */}
         <Form.Group className="mb-3" controlid="nft.Desc">
              <FloatingLabel controlid="floatingInput" label="Give it a description">
                 <Form.Control 
                     as="textarea" 
                     placeholder='Give it a description'
                     rows={5}
                     onChange={e => setFormData({...formData, nftDesc:e.target.value})}/>
             </FloatingLabel>
         </Form.Group>
         <Form.Group className="mb-3" controlid="nft.ListPrice">
              <FloatingLabel controlid="floatingInput" label="Set your Listing Price">
                 <Form.Control 
                     as="textarea" 
                     placeholder='Set your Listing Price'
                     onChange={e => setFormData({...formData, nftListPrice:e.target.value})}/>
             </FloatingLabel>
         </Form.Group>
        <InputGroup className="mb-3 justify-content-center" controlid="nft.Royalty">
                 <FloatingLabel controlid="floatingInput" label="Set your royalty scheme">
                     <Form.Control 
                          as="input" 
                          placeholder="Set your royalty percentage"
                          aria-label="Dollar amount (with dot and 1 decimal places)" 
                          onChange={e => setFormData({...formData, nftRoyalty:e.target.value})}/>
                 </FloatingLabel>
                 
                 <Button variant="outline-secondary" disabled><i className="bi bi-percent"></i>
                     </Button>
              </InputGroup>
    </Container>
  )
}

export default AddMetadata