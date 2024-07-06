from flask import Flask
from flask_cors import CORS


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