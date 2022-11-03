
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

import DefaultProfilePicture from '../../../assets/images/gorilla.png';
import nftyimg from '../../../assets/images/NT_White_Isotype.png'
import { useMoralis } from 'react-moralis'
import { useMoralisFile } from "react-moralis";
import axios from 'axios'
import * as Desktop from '../../nftyCSS/ContactModalDesktop'
import * as Mobile from '../../nftyCSS/ContactModalMobile'


function ContactModal(props) {
    const {isAuthenticated, user} = useMoralis();
    const [fullname, setFullname] = useState('');

    const [fullnameEntered, setFullnameEntered] = useState('');


    const { saveFile } = useMoralisFile();



    const [email, setEmail] = useState('');
    const [emailEntered, setEmailEntered] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneEntered, setPhoneEntered] = useState('');
    const [message, setMessage] = useState('');
    const [messageEntered, setMessageEntered] = useState('');
    const [width, setWindowWidth] = useState()

    useEffect(async() => {
        updateDimensions();

        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize",updateDimensions);
    }, []);

    const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

    const responsive = {
        showTopNavMenu: width > 1023
    }


    const saveUserInfo = async(e) => {
        
        
        e.preventDefault();

		const objt = { fullname, phone, email, message };
		console.log(objt)
		await axios
			.post(
				'https://sheet.best/api/sheets/1acadecb-6d2e-4333-b28a-5320f133a495',
				objt
			)
			.then((response) => {
				console.log(response);
			});


    }


    return (

        (responsive.showTopNavMenu) ? (
            <Desktop.ProfileEditSection>
                <Desktop.ProfileEditSubSection>
                    <Desktop.EditProfile >
                        Contact Us
                    </Desktop.EditProfile>
                    <Desktop.ProfileForm>
                        <Desktop.BioForm>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Full Name
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="username" 
                            placeholder="Full Name" 
                            onInput={e => setFullname(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Email
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="email" 
                            placeholder="Email" 
                            onInput={e => setEmail(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Phone Number
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                            type="phone" 
                            placeholder="Phone Number" 
                            onInput={e => setPhone(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Message
                                </Desktop.BioLabel>
                                <Desktop.BioInputLarge
                                type="message" 
                            placeholder="Enter Message..."
                            rows={5} 
                            onInput={e => setMessage(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        

                        </Desktop.BioForm>


                        <Desktop.SaveButton onClick={(e)=>saveUserInfo(e)}>
                            <Desktop.SaveText>Submit</Desktop.SaveText>
                        </Desktop.SaveButton>
                    </Desktop.ProfileForm>    
                </Desktop.ProfileEditSubSection>
            </Desktop.ProfileEditSection>   
        ) : (
            <Mobile.ProfileEditSection>
                <Mobile.ProfileEditSubSection>
                    <Mobile.EditProfile >
                        Contact Us
                    </Mobile.EditProfile>
                    <Mobile.ProfileForm>
                        <Mobile.BioForm>
                        <Mobile.BioGroup>
                            <Mobile.BioSubGroup>
                                <Mobile.BioLabel>
                                    Full Name
                                </Mobile.BioLabel>
                                <Mobile.BioInput
                                type="username" 
                            placeholder="Full Name" 
                            onInput={e => setFullname(e.target.value)}/>
                                <Mobile.BioTextField/>
                            </Mobile.BioSubGroup>
                        </Mobile.BioGroup>
                        <Mobile.BioGroup>
                            <Mobile.BioSubGroup>
                                <Mobile.BioLabel>
                                    Email
                                </Mobile.BioLabel>
                                <Mobile.BioInput
                                type="email" 
                            placeholder="Email" 
                            onInput={e => setEmail(e.target.value)}/>
                                <Mobile.BioTextField/>
                            </Mobile.BioSubGroup>
                        </Mobile.BioGroup>
                        <Mobile.BioGroup>
                            <Mobile.BioSubGroup>
                                <Mobile.BioLabel>
                                    Phone Number
                                </Mobile.BioLabel>
                                <Mobile.BioInput
                            type="phone" 
                            placeholder="Phone Number" 
                            onInput={e => setPhone(e.target.value)}/>
                                <Mobile.BioTextField/>
                            </Mobile.BioSubGroup>
                        </Mobile.BioGroup>
                        
                        <Mobile.BioGroup>
                            <Mobile.BioSubGroup>
                                <Mobile.BioLabel>
                                    Message
                                </Mobile.BioLabel>
                                <Mobile.BioInputLarge
                                type="message" 
                            placeholder="Enter Message..."
                            rows={5} 
                            onInput={e => setMessage(e.target.value)}/>
                                <Mobile.BioTextField/>
                            </Mobile.BioSubGroup>
                        </Mobile.BioGroup>
                        

                        </Mobile.BioForm>


                        <Mobile.SaveButton onClick={(e)=>saveUserInfo(e)}>
                            <Mobile.SaveText>Submit</Mobile.SaveText>
                        </Mobile.SaveButton>
                    </Mobile.ProfileForm>    
                </Mobile.ProfileEditSubSection>
            </Mobile.ProfileEditSection>   
        )
        
            
    )
}

export default ContactModal

