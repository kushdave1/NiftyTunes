
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import nftyimg from '../../../assets/images/NT_White_Isotype.png'


function ProfileInfo(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Enter Your Details!
            </Modal.Title>
            <Form style={{padding: "30px"}}>
                <Form.Group className="mb-3" controlId="formArtistName">
                    <Form.Label>Artist Name</Form.Label>
                    <Form.Control 
                    type="username" 
                    placeholder="Enter username" 
                    onInput={e => props.setUsernameEntered(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formArtistName">
                    <Form.Label>Artist Description</Form.Label>
                    <Form.Control 
                    rows={5}
                    type="description" 
                    placeholder="Artist Description" 
                    onInput={e => props.setDescriptionEntered(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formArtistType">
                    <Form.Label>Type of Artist</Form.Label>
                    <Form.Select aria-label="Default select example" onInput={e => props.setArtistTypeEntered(e.target.value)}>
                        <option>Open this select menu</option>
                        <option value="Visual Animator">Visual Animator</option>
                        <option value="Musician">Musician</option>
                        <option value="Collector">Collector</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProfilePic">
                    <Form.Label>Upload a Profile Picture!</Form.Label>
                    <Form.Control 
                                        type="file" 
                                        placeholder="Upload ProPic" 
                                        onInput={e => {props.setFileTarget(e.target.files[0]); console.log(e.target.files[0]);}}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProfilePic">
                    <Form.Label>Upload a Banner!</Form.Label>
                    <Form.Control 
                                        type="file" 
                                        placeholder="Upload Banner" 
                                        onInput={e => {props.setBannerFileTarget(e.target.files[0]); console.log(e.target.files[0]);}}>
                    </Form.Control>
                </Form.Group>

                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{props.handleClose();props.handleSocialsShow();}}>
                    Next
                </Button>
            </Form>       
        </Modal>
    )
}

export default ProfileInfo