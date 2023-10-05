from flask import Flask, Response, request
from flask_cors import CORS

from utils.model import spec, response
from utils.server import predict

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return Response(response=spec, status=200, mimetype="text/plain")

@app.route("/api/predict", methods=["GET"])
def get_predict():
    content = request.args.get("content")
    if content is not None:
        return response(True, "Successfully predicted content", predict(content))
    return response(False, "Missing 'content' field")

@app.route("/api/predict", methods=["POST"])
def post_predict():
    content = request.get_json()["content"]
    if content is not None:
        return response(True, "Successfully predicted content", predict(content))
    return response(False, "Missing 'content' field")

app.run("127.0.0.1", port="5500")
