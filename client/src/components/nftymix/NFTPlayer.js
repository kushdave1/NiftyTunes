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


function NFTPlayer({output}) {
  const { resolveLink } = useIPFS();
  const [tokenVideo, setTokenVideo] = useState('')

  const [play, setPlay] = useState(true)
  const [mute, setMute] = useState(true)
  const player = useRef(null)

  useEffect(() => {
    console.log(output, "this video for me")
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

  const MuteUnmute = () => {
    if (mute) {
        setMute(false)
        player.current.muted = false
    } else {
        setMute(true)
        player.current.muted = true
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
        <video ref={player}
              crossOrigin='true'
              crossoriginresourcepolicy= 'false'
              height="367.5"
              width="100%"
              src={tokenVideo}
              onError={onError}
              loop={true}
              autoPlay
              muted>
        </video>
        <button style={{position: "absolute", marginTop: "310px", marginLeft: "8px", 
        borderRadius: "5rem", backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { e.preventDefault(); PlayPause();}}>{
            (play) ? (<img src={pauseButton} height="40px" width="40px" />) : (<img src={playButton} height="40px" width="40px" />)
            }</button>
        
        <button style={{position: "absolute", marginTop: "12px", marginLeft: "305px", 
        borderRadius: "5rem", backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { e.preventDefault(); MuteUnmute();}}>{
            (mute) ? (<img src={muteButton} height="35px" width="35px" />) : (<img src={unmuteButton} height="35px" width="35px" />)
            }</button>
    </React.Fragment>
  )
}

export default NFTPlayer