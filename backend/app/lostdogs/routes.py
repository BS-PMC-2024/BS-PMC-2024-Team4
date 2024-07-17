from flask import jsonify, request
from app.lostdogs import ld;
from app.extensions import mongo
from bson import json_util
from bson import ObjectId
import base64


@ld.route('getAllDogs/', methods=['GET'])
def getAllDogs():
    try:
        dog_db = mongo.client.get_database("lostDogs").get_collection("lostdog")
        dogs = list(dog_db.find({}, {"_id": 0}))  # Retrieve all documents
        
        for dog in dogs:
            if 'avatar' in dog:
                dog['avatar'] = base64.b64encode(dog['avatar']).decode('utf-8')
        
        return json_util.dumps(dogs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    