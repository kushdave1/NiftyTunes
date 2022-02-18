from flask import Flask

app = Flask(__name__)

#Members API Route
@app.route("/mix", methods=["POST"], strict_slashes = False)
def mix():
    audio = request.json["audioFile"]
    video = request.json["videoFile"]

    files = [audio, video]

    return files

    


if __name__ == "__main__":
    app.run(debug=True)