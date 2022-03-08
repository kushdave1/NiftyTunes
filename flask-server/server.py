import os
from flask import Flask, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
from flask_cors import CORS

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'mp4'}


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#Members API Route
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        #check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            url = url_for('uploaded_file', filename=filename)
        return url

if __name__ == "__main__":
    app.run(debug=True)