from flask import Flask, request, url_for, render_template
from moviepy.editor import *
import numpy as np
import ffmpeg
import subprocess

app = Flask(__name__)

#Members API Route
@app.route("/mix", methods=["POST"], strict_slashes = False)
def mix_files():
    videoFile = request.files['videoFile'].read()
    audioFile = request.files['audioFile'].read()

    cmd = 'ffmpeg -y -i {} -r 30 -i {} -filter:a aresample=async=1 -c:a flac -c:v copy av.mkv'.format(audioFile, videoFile)
    subprocess.call(cmd, shell=True)                                     # "Muxing Done
    print('Muxing Done')

    response = "Success"
    return response


if __name__ == "__main__":
    app.run(debug=True)