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

function NFTPlayerLarge({output}) {
  const { resolveLink } = useIPFS();
  const [tokenVideo, setTokenVideo] = useState('')

  const [play, setPlay] = useState(true)
  const [mute, setMute] = useState(true)
  const [hover, setHover] = useState(false)
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

  const handleHover = () => setHover(true)
  
  const handleNoHover = () => setHover(false)


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
              height="473px"
              width="600px"
              src={tokenVideo}
              onError={onError}
              loop={true}
              autoPlay
              muted>
        </video>
        <button style={{position: "absolute", marginTop: "6px", marginLeft: "540px", 
        backgroundColor: "transparent", borderColor: "transparent"}} 
        onClick={(e) => { e.preventDefault(); MuteUnmute();}}>{
            (hover) ? ((mute) ? (<img src={muteButton} height="35px" width="35px" />) : (<img src={unmuteButton} height="35px" width="35px" />)) : 
            ((mute) ? (<img src={muteButtonNH} height="35px" width="35px" />) : (<img src={unmuteButtonNH} height="35px" width="35px" />))
            }</button>
    </React.Fragment>
  )
}

export default NFTPlayerLarge