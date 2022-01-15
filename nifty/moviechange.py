#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Dec 27 14:58:45 2021

@author: kushdave
"""

from flask import Flask, redirect, url_for, render_template
from moviepy.editor import *


import os
from app import app
import urllib.request
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename

# ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

# def allowed_file(filename):
# 	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# 	
# @app.route('/')
# def upload_form():
# 	return render_template('upload.html')

# @app.route('/', methods=['POST'])
# def upload_image():
# 	if 'file' not in request.files:
# 		flash('No file part')
# 		return redirect(request.url)
# 	file = request.files['file']
# 	if file.filename == '':
# 		flash('No image selected for uploading')
# 		return redirect(request.url)
# 	if file and allowed_file(file.filename):
# 		filename = secure_filename(file.filename)
# 		file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
# 		#print('upload_image filename: ' + filename)
# 		flash('Image successfully uploaded and displayed below')
# 		return render_template('upload.html', filename=filename)
# 	else:
# 		flash('Allowed image types are -> png, jpg, jpeg, gif')
# 		return redirect(request.url)

# @app.route('/display/<filename>')
# def display_image(filename):
# 	#print('display_image filename: ' + filename)
# 	return redirect(url_for('static', filename='uploads/' + filename), code=301)

# if __name__ == "__main__":
#     app.run()


output='output1.mp4'

output2 = 'output2.mp4'

au_out = 'wokeup.mp3'

video_input = VideoFileClip("sam.gif")

audio_clip = AudioFileClip("file.mp3")

audio_clip = audio_clip.subclip(0,2)

audio_length = audio_clip.duration
video_length = video_input.duration

mult = audio_length/video_length



    

video_input = video_input.set_fps(video_input.fps/mult)

video_input = video_input.fx(vfx.speedx, 1/mult)

video_input.write_videofile(output)

video_input_mp4 = VideoFileClip(output)

final_clip = video_input.set_audio(audio_clip)

final_clip.write_videofile(output,codec='libx264', 
                      audio_codec='aac', 
                      temp_audiofile='temp-audio.m4a', 
                      remove_temp=True)


