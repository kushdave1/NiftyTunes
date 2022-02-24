from flask import Flask, request, url_for, render_template
from moviepy.editor import *
import numpy as np

app = Flask(__name__)

#Members API Route
@app.route("/mix", methods=["POST"], strict_slashes = False)
def mix_files():
    videoFile = request.files['videoFile'].stream.read()
    audioFile = request.files['audioFile'].read()

    #print(type(videoFile))

    videoFile.endswith(tuple(videoFile))
    video_clip = VideoFileClip(tuple(videoFile))
    audio_clip = AudioFileClip(audioFile)

    audio_length = audio_clip.duration
    video_length = video_clip.duration

    video_smaller = list(np.arrange(0.00, video_length, .0001))
    video_larger = list(np.arrange(0.00, audio_length, .0001))

    for i in range(len(video_smaller)):
        video_smaller[i]="{:.4f}".format(video_smaller[i])

    for i in range(len(video_larger)):
        video_larger[i]="{:.4f}".format(video_larger[i])

    
        
    if (audio_length % video_length) != 0:
        for i in video_smaller:
            for j in video_larger:
                video_length_sm = video_length-float(i)
                video_length_lg = float(j)
            
            if (audio_length % video_length_sm) == 0:
                video_length = video_length_sm
                print(video_length_sm)
                breakout_flag = True
                break
            elif (audio_length % video_length_lg) == 0:
                video_length = video_length_lg
                print(video_length_lg)
                breakout_flag = True
                break
                
            if breakout_flag:
                break
    
    
    mult = video_length/video_input.duration
    
    # set fps of video 
  
    video_clip = video_clip.set_fps(video_clip.fps/mult)
    video_clip = video_clip.fx(vfx.speedx, 1/mult)
    video_clip = video_clip.loop(duration = audio_length)
    
    video_clip.write_videofile(output)


    #output video
    video_input_mp4 = VideoFileClip(output)
    
    final_clip = video_clip.set_audio(audio_clip)
    final_clip.write_videofile(output,codec='libx264', 
                          audio_codec='aac', 
                          temp_audiofile='temp-audio.m4a', 
                          remove_temp=True)

    response = "Success"
    return response


if __name__ == "__main__":
    app.run(debug=True)