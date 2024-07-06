from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import firebase_admin
from firebase_admin import credentials, auth

#Firebase
cred = credentials.Certificate("C:\Users\dori1\project\BS-PMC-2024-Team4\backend\dogworry-37217-firebase-adminsdk-sdrex-9460d7f8ff.json")
firebase_admin.initialize_app(cred)

#MongoDb
uri = "mongodb+srv://doryu:JXG6z9PaWmQYFVqD@dogworry.iutobjz.mongodb.net/?retryWrites=true&w=majority&appName=DogWorry"
client = MongoClient(uri)
try:
    database = client.get_database("sample_mflix")
    movies = database.get_collection("movies")
    # Query for a movie that has the title 'Back to the Future'
    query = { "title": "Back to the Future" }
    movie = movies.find_one(query)
    print(movie)
    client.close()
except Exception as e:
    raise Exception("Unable to find the document due to the following error: ", e)


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "<p>Hello<p>"

# for testing
@app.route('/getmaps', methods=['GET'])
def getmaps():
    return {'message': 'maps'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)