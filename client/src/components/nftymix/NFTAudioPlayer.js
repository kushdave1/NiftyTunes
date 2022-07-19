import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
import {fixURL, fixImageURL} from "../nftyFunctions/fixURL"

//bootstrap
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import playButton from '../../assets/images/play.png'
import pauseButton from '../../assets/images/pause.png'
import muteButton from '../../assets/images/mutebutton.png'
import unmuteButton from '../../assets/images/unmutebutton.png'

function NFTAudioPlayer({output, audio}) {
  const { resolveLink } = useIPFS();
  const [tokenImage, setTokenImage] = useState('')
  const [play, setPlay] = useState(false)
  const [mute, setMute] = useState(false)
  const player = useRef(null)

  useEffect(() => {
    
    setTokenImage(resolveLink(audio))
    console.log(player.current)
  }, []);

  const PlayPause = () => {
    if (play) {
        setPlay(false)
        player.current.pause()
    } else {
        setPlay(true)
        player.current.play()
    }
  }

  const MuteUnmute = () => {
    if (mute) {
        setMute(false)
        player.current.muted = false
    } else {
        setMute(true)
        player.current.muted = true
    }
  }


  const onError = () => {
    
    setTokenImage(fixURL(audio))
  }

  return (
    <React.Fragment>
        <img 
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="367.5"
              src={output}
              onError={onError}
              >
        </img>
        <audio ref={player} crossOrigin='true'
              crossoriginresourcepolicy='false' src={tokenImage}></audio>
        <button style={{position: "absolute", marginTop: "312px", marginLeft: "10px", 
        borderRadius: "5rem", backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { e.preventDefault(); PlayPause();}}>{
            (play) ? (<img src={pauseButton} height="35px" width="35px" />) : (<img src={playButton} height="35px" width="35px" />)
            }</button>
        
        <button style={{position: "absolute", marginTop: "12px", marginLeft: "305px", 
        borderRadius: "5rem", backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { e.preventDefault(); MuteUnmute();}}>{
            (mute) ? (<img src={muteButton} height="35px" width="35px" />) : (<img src={unmuteButton} height="35px" width="35px" />)
            }</button>
    </React.Fragment>
  )
}

export default NFTAudioPlayer