import React, {useRef} from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
//bootstrap
import Container from 'react-bootstrap/Container'
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'

import playButton from '../../assets/images/playnew.png'
import pauseButton from '../../assets/images/pausenew.png'
import muteButton from '../../assets/images/mutebutton.png'
import unmuteButton from '../../assets/images/unmutebutton.png'
import muteButtonNH from '../../assets/images/mutenohover.png'
import unmuteButtonNH from '../../assets/images/unmutenohover.png'
import fullscreen from '../../assets/images/fullscreen.png'
import { Stream } from "@cloudflare/stream-react";


function NFTPlayerModals({output}) {
  const { resolveLink } = useIPFS();
  const [tokenVideo, setTokenVideo] = useState('')

  const [play, setPlay] = useState(false)
  const [mute, setMute] = useState(true)
  const [hover, setHover] = useState(false)
  const [hoverButton, setHoverButton] = useState(false)
  const player = useRef(null)

  useEffect(() => {
    setTokenVideo(resolveLink(output))
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

  const isHover = () => {
    player.addEventListener('mouseenter', handleHover)
    console.log(hover)
  }

  const isHoverButton = () => {
    let muteButton = document.getElementsByClassName("mute-button")
    muteButton.addEventListener('mouseenter', handleHoverButton)
    console.log(hover)
  }

  const handleHover = () => setHover(true)
  
  const handleNoHover = () => setHover(false)

  const handleHoverButton = () => setHoverButton(true)
  
  const handleNoHoverButton = () => setHoverButton(false)


  const MuteUnmute = () => {
    if (mute) {
        setMute(false)
        player.current.muted = false
    } else {
        setMute(true)
        player.current.muted = true
    }
  }

  const setFullScreen = () => {
    let elem = document.querySelector("video");

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }


  // const fixURL = (url) => {
  //       if(url.startsWith("ipfs")){
  //         if(url.split("ipfs://").pop().includes("ipfs")) {
  //           return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop().split("ipfs/").pop()
  //         } else {
  //       return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
  //       }
  //   }
  // };
  // const fixImageURL = (url) => {
  //     if(url.startsWith("/ipfs")){
  //     return "https://ipfs.moralis.io:2053"+url
  //     }
  //     else {
  //     return url+"?format=json"
  //     }
  // };

  const onError = () => {
    setTokenVideo(fixURL(output))
  }

  return (
    
    <React.Fragment>
        <video className="hover-video"
        ref={player}
              webkit-playsInline playsInline
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              onMouseOver={()=>handleHover()}
              onMouseOut={()=>handleNoHover()}
              height="246px"
              width="310px"
              src={tokenVideo}
              onError={onError}
              loop={true}
              autoPlay
              muted

              >
        </video>
        {/* <button style={{position: "absolute", marginTop: "200px", marginLeft: "2%", 
        borderRadius: "5rem", backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { console.log("HI"); e.preventDefault(); PlayPause();}}>{
            (play) ? (<img src={pauseButton} height="35px" width="35px" />) : (<img src={playButton} height="35px" width="35px" />)
            }</button> */}
        
        <button className="mute-button" style={{position: "absolute", top: "2%", marginLeft: "83%", 
        backgroundColor: "transparent", borderColor: "transparent"}} 
        onMouseOver={()=>handleHoverButton()}
        onMouseOut={()=>handleNoHoverButton()}
        onClick={(e) => { e.preventDefault(); MuteUnmute();}}>{
            (hover || hoverButton) ? ((mute) ? (<img src={muteButton} style={{height:"35px", minWidth:"35px"}} />) : (<img src={unmuteButton} style={{height:"35px", minWidth:"35px"}} />)) : 
            ((mute) ? (<img src={muteButtonNH} style={{height:"35px", minWidth:"35px"}} />) : (<img src={unmuteButtonNH} style={{height:"35px", minWidth:"35px"}} />))
            }</button>
        <button style={{position: "absolute", top: "200px", marginLeft: "84%", 
        backgroundColor: "transparent", borderColor: "transparent"}} onClick={(e)=> { e.preventDefault(); setFullScreen();}}>
        <img src={fullscreen} style={{height:"30px", minWidth:"30px"}}/>
        </button>

    </React.Fragment>
  )
}

export default NFTPlayerModals