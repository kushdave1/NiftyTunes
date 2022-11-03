
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'

import DefaultProfilePicture from '../../../assets/images/gorilla.png';
import nftyimg from '../../../assets/images/NT_White_Isotype.png'
import { useMoralis } from 'react-moralis'
import { useMoralisFile } from "react-moralis";
import * as Desktop from '../../nftyCSS/ProfileInfoDesktop'
import * as Mobile from '../../nftyCSS/ProfileInfoMobile'
import { Navigate } from 'react-router'


function ProfileInfo(props) {

    let navigate = useNavigate()

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


    const {isAuthenticated, user} = useMoralis();
    const [username, setUsername] = useState('');
    const [artistType, setArtistType] = useState('');

    const [imageURL, setImageURL] = useState('')

    const [profilePhoto, setProfilePhoto] = useState('');
    const [usernameEntered, setUsernameEntered] = useState('');
    const [etherscan, setEtherscan] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionEntered, setDescriptionEntered] = useState('');
    const [artistTypeEntered, setArtistTypeEntered] = useState('');
    const [bannerPhoto, setBannerPhoto] = useState('')
    const [fileTarget, setFileTarget] = useState();
    const [bannerFileTarget, setBannerFileTarget] = useState();

    const { saveFile } = useMoralisFile();



    const [twitter, setTwitter] = useState('');
    const [twitterEntered, setTwitterEntered] = useState('');
    const [instagram, setInstagram] = useState('');
    const [instagramEntered, setInstagramEntered] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [tiktokEntered, setTiktokEntered] = useState('');
    const [discord, setDiscord] = useState('');
    const [discordEntered, setDiscordEntered] = useState('');




    useEffect(() => {
        console.log(fileTarget)
        if(!user) return null;
        setUsername(user.get('username'));
        setDescription(user.get('description'))
        setArtistType(user.get('artistType'));
        setProfilePhoto(user.get("profilePhotoURL"))
        setTwitter(user.get('twitter'));
        setInstagram(user.get('instagram'));
        setDiscord(user.get('discord'))
        setTiktok(user.get('tiktok'));
    })

    const saveUserInfo = async() => {
        console.log(profilePhoto, "RANG")
        if (usernameEntered !== "") {
            user.set('username', usernameEntered)
        }

        if (descriptionEntered !== "") {
            user.set('description', descriptionEntered)
        }

        if (artistTypeEntered !== "") {
            user.set('artistType', artistTypeEntered)
        }

        if (twitterEntered !== "") {
            user.set('twitter', twitterEntered)
        }

        if (instagramEntered !== "") {
            user.set('instagram', instagramEntered)
        }

        if (discordEntered !== "") {
            user.set('discord', discordEntered)
        }

        if (tiktokEntered !== "") {
            user.set('tiktok', tiktokEntered)
        }
    
        if (fileTarget !== "") {
            await saveFile("photo.jpg", fileTarget, {
            type: "image",
            onSuccess: (result) => {user.set('profilePhoto', result); user.set('profilePhotoURL', result.url());console.log(result)},
            onError: (error) => console.log(error),
            });

            
        }
        if (bannerFileTarget !== "") {
            await saveFile("photo.jpg", bannerFileTarget, {
                type: "image",
                onSuccess: (result) => {user.set('bannerPhoto', result); user.set('bannerPhotoURL', result.url());console.log(result)},
                onError: (error) => console.log(error),
            });
        }

        
        
        
        await user.save();
        

        setUsername(user.get('username'));
        setDescription(user.get('description'));
        setArtistType(user.get('artistType'));
        setProfilePhoto(user.get('profilePhotoURL'));

        setTwitter(user.get('twitter'));
        setInstagram(user.get('instagram'));
        setDiscord(user.get('discord'));
        setTiktok(user.get('tiktok'));
        navigate('/profile')


    }


    return (
        <>
        {(responsive.showTopNavMenu) ? (
            <Desktop.ProfileEditSection>
                <Desktop.ProfileEditSubSection>
                    <Desktop.EditProfile >
                        Edit Profile
                    </Desktop.EditProfile>
                    <Desktop.ProfileForm>
                        <Desktop.ProfileSubSection>
                            <Desktop.ProfilePicSection>
                                {(imageURL !== '') ? (<Desktop.ProPic src={imageURL} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (profilePhoto) ? (<Desktop.ProPic src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<Desktop.ProPic src={DefaultProfilePicture}/>)}
                                <Desktop.UploadForm>
                                    <Desktop.ProfilePictureLabel>
                                        <Desktop.ProPicText>Profile Picture</Desktop.ProPicText>
                                        <Desktop.FileSizeRequirements>.png, .jpg, .jpeg</Desktop.FileSizeRequirements>
                                    </Desktop.ProfilePictureLabel>
                                    
                                  
                                        <Desktop.UploadInput
                                        type="file"
                                        style={{color:"transparent", width:"110px"}}
                                        
                                        onChange={(e) => {setFileTarget(e.target.files?.item(0)); setImageURL(URL.createObjectURL(e.target.files?.item(0)))}}/>
                                        
                                </Desktop.UploadForm>
                                <Desktop.UploadForm>
                                    <Desktop.ProfilePictureLabel>
                                        <Desktop.ProPicText>Cover Photo</Desktop.ProPicText>
                                        <Desktop.FileSizeRequirements>.png, .jpg, .jpeg</Desktop.FileSizeRequirements>
                                    </Desktop.ProfilePictureLabel>
                                    
                                  
                                        <Desktop.UploadInput
                                        type="file"
                                        style={{color:"transparent", width:"110px"}}
                                        onChange={(e) => setBannerFileTarget(e.target.files?.item(0))}/>
                                    
                                </Desktop.UploadForm>
                            </Desktop.ProfilePicSection>
                        </Desktop.ProfileSubSection>
                        <Desktop.BioForm>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Username
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="username" 
                            placeholder="Enter username" 
                            defaultValue={username}
                            onInput={e => setUsernameEntered(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Bio
                                </Desktop.BioLabel>
                                <Desktop.BioInputLarge
                                rows={5}
                            type="description" 
                            placeholder="Artist Description" 
                            defaultValue={description}
                            onInput={e => setDescriptionEntered(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Twitter
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="twitter" 
                            placeholder="@" 
                            defaultValue={twitter}
                            onInput={e => setTwitterEntered(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Instagram
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="instagram" 
                            placeholder="@" 
                            defaultValue={instagram}
                            onInput={e => setInstagramEntered(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Discord
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="discord" 
                            placeholder="@" 
                            defaultValue={discord}
                            onInput={e => setDiscordEntered(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>
                        <Desktop.BioGroup>
                            <Desktop.BioSubGroup>
                                <Desktop.BioLabel>
                                    Tiktok
                                </Desktop.BioLabel>
                                <Desktop.BioInput
                                type="tiktok" 
                            placeholder="@" 
                            defaultValue={tiktok}
                            onInput={e => setTiktokEntered(e.target.value)}/>
                                <Desktop.BioTextField/>
                            </Desktop.BioSubGroup>
                        </Desktop.BioGroup>

                        </Desktop.BioForm>


                        <Desktop.SaveButton onClick={()=>saveUserInfo()}>
                            <Desktop.SaveText>Save Changes</Desktop.SaveText>
                        </Desktop.SaveButton>
                    </Desktop.ProfileForm>    
                </Desktop.ProfileEditSubSection>
            </Desktop.ProfileEditSection>   
        ) : (
            <Mobile.ProfileEditSection>
                <Mobile.ProfileEditSubSection>
                    <Mobile.EditProfile >
                        Edit Profile
                    </Mobile.EditProfile>
                    <Mobile.ProfileForm>
                        <Mobile.ProfileSubSection>
                            <Mobile.ProfilePicSection>
                            {(imageURL) ? (<Mobile.ProPic src={imageURL} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (profilePhoto) ? (<Mobile.ProPic src={profilePhoto} crossOrigin='true' crossoriginresourcepolicy='false'/>) : (<Mobile.ProPic src={DefaultProfilePicture}/>)}
                                <Mobile.UploadForm>
                                    <Mobile.ProfilePictureLabel>
                                        <Mobile.ProPicText>Profile Picture</Mobile.ProPicText>
                                        <Mobile.FileSizeRequirements>.png, .jpg, .jpeg</Mobile.FileSizeRequirements>
                                    </Mobile.ProfilePictureLabel>
                                    
                                  
                                        <Mobile.UploadInput
                                        type="file"
                                        style={{color:"transparent", width:"150px"}}
                                        
                                        onChange={(e) => {setFileTarget(e.target.files?.item(0)); setImageURL(URL.createObjectURL(e.target.files?.item(0)))}}/>
                                        
                                </Mobile.UploadForm>
                                
                            </Mobile.ProfilePicSection>
                        </Mobile.ProfileSubSection>
                        <Mobile.BioForm>
                            <Mobile.BioGroup>
                                <Mobile.BioSubGroup>
                                    <Mobile.BioLabel>
                                        Username
                                    </Mobile.BioLabel>
                                    <Mobile.BioInput
                                    type="username" 
                                placeholder="Enter username" 
                                defaultValue={username}
                                onInput={e => setUsernameEntered(e.target.value)}/>
                                    <Mobile.BioTextField/>
                                </Mobile.BioSubGroup>
                            </Mobile.BioGroup>
                            <Mobile.BioGroup>
                                <Mobile.BioSubGroup>
                                    <Mobile.BioLabel>
                                        Bio
                                    </Mobile.BioLabel>
                                    <Mobile.BioInputLarge
                                    rows={5}
                                type="description" 
                                placeholder="Artist Description" 
                                defaultValue={description}
                                onInput={e => setDescriptionEntered(e.target.value)}/>
                                    <Mobile.BioTextField/>
                                </Mobile.BioSubGroup>
                            </Mobile.BioGroup>
                            <Mobile.BioGroup>
                                <Mobile.BioSubGroup>
                                    <Mobile.BioLabel>
                                        Twitter
                                    </Mobile.BioLabel>
                                    <Mobile.BioInput
                                    type="twitter" 
                                placeholder="@" 
                                defaultValue={twitter}
                                onInput={e => setTwitterEntered(e.target.value)}/>
                                    <Mobile.BioTextField/>
                                </Mobile.BioSubGroup>
                            </Mobile.BioGroup>
                            <Mobile.BioGroup>
                                <Mobile.BioSubGroup>
                                    <Mobile.BioLabel>
                                        Instagram
                                    </Mobile.BioLabel>
                                    <Mobile.BioInput
                                    type="instagram" 
                                placeholder="@" 
                                defaultValue={instagram}
                                onInput={e => setInstagramEntered(e.target.value)}/>
                                    <Mobile.BioTextField/>
                                </Mobile.BioSubGroup>
                            </Mobile.BioGroup>
                            <Mobile.BioGroup>
                                <Mobile.BioSubGroup>
                                    <Mobile.BioLabel>
                                        Discord
                                    </Mobile.BioLabel>
                                    <Mobile.BioInput
                                    type="discord" 
                                placeholder="@" 
                                defaultValue={discord}
                                onInput={e => setDiscordEntered(e.target.value)}/>
                                    <Mobile.BioTextField/>
                                </Mobile.BioSubGroup>
                            </Mobile.BioGroup>
                            <Mobile.BioGroup>
                                <Mobile.BioSubGroup>
                                    <Mobile.BioLabel>
                                        Tiktok
                                    </Mobile.BioLabel>
                                    <Mobile.BioInput
                                    type="tiktok" 
                                placeholder="@" 
                                defaultValue={tiktok}
                                onInput={e => setTiktokEntered(e.target.value)}/>
                                    <Mobile.BioTextField/>
                                </Mobile.BioSubGroup>
                            </Mobile.BioGroup>

                        </Mobile.BioForm>


                        <Mobile.SaveButton onClick={()=>{saveUserInfo();}}>
                            <Mobile.SaveText>Save Changes</Mobile.SaveText>
                        </Mobile.SaveButton>
                    </Mobile.ProfileForm>    
                </Mobile.ProfileEditSubSection>
            </Mobile.ProfileEditSection>   
        )}
        </>
            
    )
}

export default ProfileInfo

