import React, {useState, useEffect} from 'react'

//bootstrap
import Row from 'react-bootstrap/Row'

//custom components
import NFTPlayer from './NFTPlayer';


function NFTMixer({formData, setFormData, ffmpeg, fetchFile}) {
   
  const [output, setOutput] = useState();
  const [resultFile, setResultFile] = useState();
  const [mixMessage, setMixMessage] = useState('');
  const [mintErrMessage, setMintErrMessage] = useState('');
  const [isMixing, setIsMixing] = useState(false);
  const [fileType, setFileType] = useState('');

  const convertToGif = async() => {
    setResultFile(null)
    
    const loadVideo = file => new Promise((resolve, reject) => {
      try {
          let video = document.createElement('video');
          video.preload = 'metadata';
  
          video.onloadedmetadata = function () {
              resolve(this);
          }
  
          video.onerror = function () {
              reject("Please select a valid video file.");
          }
  
          video.src = window.URL.createObjectURL(file);
      } catch (e) {
          reject(e);
      }
    });

      if(await formData.visualFile.type.includes('image')){
        //if input is an image
        setMixMessage('');
        setIsMixing(true);

        console.log(formData.visualFile.type);
        ffmpeg.FS('writeFile', 'video.png', await fetchFile(formData.visualFile));
        ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(formData.audioFile));
        
        const audioDuration = await loadVideo(formData.audioFile);
        const audioDur = await audioDuration.duration;
        const audioDurSecond = audioDur-0.25;
        const fadeIn = "afade=t=in:st=0:d=0.25,afade=t=out:st="+`${audioDurSecond}`+":d=0.25";

        await ffmpeg.run('-i', 'audio.wav', '-af', `${fadeIn}`, 'audio1.wav')

        await ffmpeg.run('-framerate', '1/10', '-i', 'video.png', '-c:v', 'libx264', '-t', `${audioDur}`, '-pix_fmt', 'yuv420p', '-vf', 'scale=4000:4000', 'output.mp4');
        await ffmpeg.run('-i', 'output.mp4', '-i', 'audio1.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');
        const data = ffmpeg.FS('readFile', 'out.mp4');

        await setFormData({...formData, outputFile: data});

        //create url
        const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
        await setFormData({...formData, playerSrc: url})
        await setFileType('video')
        setIsMixing(false);
    }
    else if(await formData.visualFile.type.includes('video')){
        //if file is a video
        setMixMessage('');
    
        //write the file to memory
        setIsMixing(true);
        ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(formData.visualFile));
        ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(formData.audioFile));

        const videoDuration = await loadVideo(formData.visualFile);
        const audioDuration = await loadVideo(formData.audioFile);

        const videoDur = await videoDuration.duration;
        const audioDur = await audioDuration.duration;

        const audioDurSecond = audioDur-0.25;

        const mult = 1/(videoDur/audioDur);
        
        const setDuration = "setpts="+`${mult}`+"*PTS"

        await ffmpeg.run('-i', 'video.mp4', '-filter:v', `${setDuration}`, 'output.mp4')

        const fadeIn = "afade=t=in:st=0:d=0.25,afade=t=out:st="+`${audioDurSecond}`+":d=0.25";

        await ffmpeg.run('-i', 'audio.wav', '-af', `${fadeIn}`, 'audio1.wav')

        // //run ffmpeg command
        await ffmpeg.run('-i', 'output.mp4', '-i', 'audio1.wav', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', 'out.mp4');

        const data = ffmpeg.FS('readFile', 'out.mp4')
        console.log(data);
    

        const rf = new Blob([data.buffer], {type: 'video/mp4'});

    
        await setFormData({...formData, outputFile: data});

        //create a URL
        const url = URL.createObjectURL(rf);
        await setFormData({...formData, playerSrc: url})

        await setFileType('video')
        setIsMixing(false)
    
    }
}

  useEffect(() => {
      console.log(formData.visualFile);
      console.log(formData.audioFile);
      const renderLoop = async() => {
          if(formData.outputFile == null){
            await convertToGif();
          }
        
      }

      renderLoop().catch(console.error);
     
  }, []);


  return (
      
      <div>
       {isMixing?
          (<h1>mixing</h1>):
          
          (
            <NFTPlayer output={formData.playerSrc} />
          )
       }
      </div>
  )
}

export default NFTMixer