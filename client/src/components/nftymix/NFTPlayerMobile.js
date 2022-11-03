import React, {useRef} from 'react'
import { useState, useEffect } from 'react'
import { useIPFS } from "hooks/useIPFS";
//bootstrap
import Container from 'react-bootstrap/Container'
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'

import playButton from '../../assets/images/play.png'
import pauseButton from '../../assets/images/pause.png'
import muteButton from '../../assets/images/mutebutton.png'
import unmuteButton from '../../assets/images/unmutebutton.png'
import muteButtonNH from '../../assets/images/mutenohover.png'
import unmuteButtonNH from '../../assets/images/unmutenohover.png'
import fullscreen from '../../assets/images/fullscreen.png'
import { Stream } from "@cloudflare/stream-react";


function NFTPlayer({output, nftFrom}) {
  const { resolveLink } = useIPFS();
  const [tokenVideo, setTokenVideo] = useState('')

  const [play, setPlay] = useState(true)
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
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              onMouseOver={()=>handleHover()}
              onMouseOut={()=>handleNoHover()}
              height="246px"
              width="310px"
              src={tokenVideo}
              onError={onError}
              controls
            
              muted>
        </video>
        {/* <button style={{position: "absolute", marginTop: "310px", marginLeft: "8px", 
        borderRadius: "5rem", backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { e.preventDefault(); PlayPause();}}>{
            (play) ? (<img src={pauseButton} height="40px" width="40px" />) : (<img src={playButton} height="40px" width="40px" />)
            }</button> */}
{/*         
        <button className="mute-button" style={{position: "absolute", top: "4%", marginLeft: "82%", 
        backgroundColor: "transparent", borderColor: "transparent"}} 
        onMouseOver={()=>handleHoverButton()}
        onMouseOut={()=>handleNoHoverButton()}
        onClick={(e) => { e.preventDefault(); MuteUnmute();}}>{
            (hover || hoverButton) ? ((mute) ? (<img src={muteButton} style={{height:"35px", minWidth:"35px"}} />) : (<img src={unmuteButton} style={{height:"35px", minWidth:"35px"}} />)) : 
            ((mute) ? (<img src={muteButtonNH} style={{height:"35px", minWidth:"35px"}} />) : (<img src={unmuteButtonNH} style={{height:"35px", minWidth:"35px"}} />))
            }</button> */}
      

    </React.Fragment>
  )
}

export default NFTPlayer