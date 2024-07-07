from flask import Flask
from flask_cors import CORS

#for mongo-db
import pymongo

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