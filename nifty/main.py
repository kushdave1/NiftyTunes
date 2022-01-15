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

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

ALLOWED_EXTENSIONS2 = set(['wav', 'mp3', 'wma'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
	
 
# def allowed_audio(filename2):
#     	return '.' in filename2 and filename2.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS2
	
@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/merch')
def merch():
	return {"merch": ["Dope", "Rad", "Hype"]}



@app.route('/', methods=['POST'])
def upload_image():
	if 'file' not in request.files:
		flash('No file part')
		return redirect(request.url)
	file = request.files['file']
	if file.filename == '':
		flash('No image selected for uploading')
		return redirect(request.url)
	if file and allowed_file(file.filename):
		filename = secure_filename(file.filename)
		file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		#print('upload_image filename: ' + filename)
		flash('Image successfully uploaded and displayed below')
		return render_template('upload.html', filename=filename)
	else:
		flash('Allowed image types are -> png, jpg, jpeg, gif')
		return redirect(request.url)

# @app.route('/', methods=['POST'])
# def upload_audio():
#     if 'file' not in request.files:
# 		flash('No file part')
# 		return redirect(request.url)
# 	file2 = request.files['file2']
# 	if file2.filename == '':
# 		flash('No image selected for uploading')
# 		return redirect(request.url)
# 	if file2 and allowed_audio(file2.filename):
# 		filename2 = secure_filename(file2.filename)
# 		file2.save(os.path.join(app.config['UPLOAD_FOLDER'], filename2))
# 		#print('upload_image filename: ' + filename)
# 		flash('Image successfully uploaded and displayed below')
# 		return render_template('upload.html', filename2=filename2)
# 	else:
# 		flash('Allowed image types are -> wav, mp3, wma')
# 		return redirect(request.url)


@app.route('/display/<filename>')
def display_image(filename):
	#print('display_image filename: ' + filename)
	return redirect(url_for('static', filename='uploads/' + filename), code=301)

# @app.route('/display/<filename2>')
# def display_audio(filename2):
# 	#print('display_image filename: ' + filename)
# 	return redirect(url_for('static', filename='uploads/' + filename2), code=301)






# @app.route('/display/<filename>')
# def mix(filename):
#     video_input = VideoFileClip(filename)
    
#     audio_clip = AudioFileClip(filename)
    
    
#     audio_length = audio_clip.duration
#     video_length = video_input.duration
    
#     mult = audio_length/video_length
    
    
    
        
    
#     video_input = video_input.set_fps(video_input.fps/mult)
    
#     video_input = video_input.fx(vfx.speedx, 1/mult)
    
#     video_input.write_videofile(output)
    
#     video_input_mp4 = VideoFileClip(output)
    
#     final_clip = video_input.set_audio(audio_clip)
    
#     final_clip.write_videofile(output,codec='libx264', 
#                           audio_codec='aac', 
#                           temp_audiofile='temp-audio.m4a', 
#                           remove_temp=True)




if __name__ == "__main__":
    app.run(debug = True)


