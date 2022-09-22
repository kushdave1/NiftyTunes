
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import nftyimg from '../../../assets/images/NT_White_Isotype.png'


function ProfileSocials(props) {
    return (
        <Modal show={props.socialsShow} onHide={props.handleSocialsClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="30px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Help fans find you on Social Media! (Links Only)
            </Modal.Title>
            <Form style={{padding: "30px"}}>
                <Form.Group className="mb-3" controlId="formTwitter">
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control 
                    type="twitter" 
                    placeholder="Twitter Link" 
                    onInput={e => props.setTwitterEntered(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formInstagram">
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control 

                    type="instagram" 
                    placeholder="Instagram Link" 
                    onInput={e => props.setInstagramEntered(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDiscord">
                    <Form.Label>Discord</Form.Label>
                    <Form.Control 
                    type="discord" 
                    placeholder="Instagram Link" 
                    onInput={e => props.setDiscordEntered(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTiktok">
                    <Form.Label>Tiktok</Form.Label>
                    <Form.Control 
                    type="tiktok" 
                    placeholder="Tiktok Link" 
                    onInput={e => props.setTiktokEntered(e.target.value)}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{props.saveUserInfo();props.handleSocialsClose();}}>
                    Submit
                </Button>
            </Form>       
        </Modal>
    )
}

export default ProfileSocials