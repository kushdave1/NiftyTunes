//React
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//Bootstrap
import Container from 'react-bootstrap/Container'
import Navigation from '../components/Navigation'
import NFTForm from '../components/NFTForm'
import MadeNFTForm from '../components/MadeNFTForm'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'

//APIs
import {useRaribleLazyMint, useMoralis} from 'react-moralis'
import { createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'

let ffmpeg = createFFmpeg({log: true});


const Body = styled.div `
    width:100%;
    height: 100vh;
    min-height:100vh;
    max-height:100vh;
    display:flex;
    flex-direction:column;
    background-color:#111111;
    overflow:auto;
`;
const NavigationSection = styled.div`

`;

const FormSection = styled.div `
    flex:1;
    overflow:hidden;
`;
const ChoiceSection = styled.div `

`;

function CreateNFT() {
    const {isAuthenticated, user} = useMoralis();
    const [isReadyMade, setIsReadyMade] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [ready, setReady] = useState(false);
    const [address,setAddress] = useState();

    const load = async() => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        if(!user) return null;

        setAddress(user.get('ethAddress'));

        if(!ffmpeg.isLoaded()){
            load();
        }
        else{
            setReady(true)
        }
    }, [user]);


    function handleNew(){
        setIsReadyMade(false);
        setIsNew(true);
    }

    function handleReadyMade(){
        setIsNew(false)
        setIsReadyMade(true)
    }
    return (
        <Body>
             <NavigationSection>
                <Navigation />
            </NavigationSection>
                
                {ready?(
                        <>
                        <ChoiceSection className="d-flex mt-1 justify-content-center">
                            <Stack direction="horizontal" gap={2}>
                                <Button 
                                    variant="primary"
                                    onClick={handleNew}>
                                    I want to make an NFT
                                </Button>{' '}

                            <Button 
                                variant="outline-light"
                                onClick={handleReadyMade}>
                                I already have an NFT
                            </Button>{' '}
                        </Stack>
                    </ChoiceSection>

                    <FormSection className="d-flex mt-3 justify-content-center">
                        {
                            isNew?(
                                <NFTForm 
                                    ffmpeg = {ffmpeg}
                                    address = {address} />
                            ):(
                                <MadeNFTForm 
                                    ffmpeg = {ffmpeg}
                                    address = {address}/>
                            )
                        
                        }
                            
                    </FormSection>
                    </>
                ):(
                        <Container fluid>
                            <Row className = 'mt-5'>
                                <div className='d-flex justify-content-center'>
                                    <h1 className = 'text-primary animate__animated animate__bounce animate__infinite infinite' style={{ fontFamily:"Pixeboy"}}>NiftyTunes</h1>
                                </div>
                            </Row>
                            <Row className = 'mt-5'>
                                <div className='d-flex justify-content-center'>
                                    <h6 className = 'text-primary' style={{fontWeight:"700"}}>Loading Packages...</h6>
                                </div>
                            </Row>
                            <Row>
                                <div className='d-flex justify-content-center'>
                                 <Spinner as='span' animation="border" variant='primary'/>
                                </div>
                            </Row>
                        </Container>
                    
                    )
                }

            </Body>
                   
    )
}

export default CreateNFT
