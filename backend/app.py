from flask import Flask
from flask_cors import CORS

#for mongodb
import pymongo
from pymongo import MongoClient
from urllib.parse import quote_plus #for decoding the user+password

"""
username = quote_plus('danieba')
password = quote_plus('daniel121298')
cluster = "dog-worry.kluw7m1.mongodb.net"
authSource = "admin"
authMechanism = "SCRAM-SHA-1"
#conn_str = ""
try:
    uri = 'mongodb+srv://' + username + ':' + password + '@' + cluster + '/?authSource=' + authSource + '&authMechanism=' + authMechanism
    client = MongoClient(uri) #"mongodb://localhost:27017/"
except:
    print("Error in connecting")
"""
uri = "mongodb+srv://danieba:daniel121298@dogworry.iutobjz.mongodb.net/?retryWrites=true&w=majority&appName=DogWorry"
client = MongoClient(uri)
# Select the database
db = client["dogWorry"]

# Select the collection
collection = db["Users"]


#for firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

#cred = credentials.Certificate('dogworry-37217-firebase-adminsdk-sdrex-9460d7f8ff.json')
# Initialize the app with a service account, granting admin privileges
#firebase_admin.initialize_app(cred, {'databaseURL': "URL to database"})

### end of firebase



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