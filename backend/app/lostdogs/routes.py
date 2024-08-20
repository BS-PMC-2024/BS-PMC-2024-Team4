import re
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
        
        return json_util.dumps(dogs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ld.route('/reportLostDog', methods=['POST'])
def reportLostDog():
    data = request.get_json()
    dog_name = data['dog_name']
    lost_area = data['lost_area']
    owner_phone = data['owner_phone']
    phone_regex = re.compile("^[0-9]+$")

    if not dog_name or not lost_area or not owner_phone:
        return {'success': False, 'error': 'All fields are required'}, 400

    if not phone_regex.match(owner_phone):
        return {'success': False, 'error': 'Invalid phone number'}, 400

    lost_dogs_db = mongo.client.get_database("lostDogs").get_collection("reportLost")

    if 'owner_phone' in data:
        phone_exist =lost_dogs_db.find_one({'owner_phone': data['owner_phone']})
        dog_exist = lost_dogs_db.find_one({'owner_phone': data['owner_phone'], 'dog_name': data['dog_name']})
       
        if phone_exist != dog_exist or not phone_regex.match(data['owner_phone']):
             return {'success': False, 'error': 'Phone already taken'}
        
    new_report = {
        'friendly': 'true',
        'identifier':'friendly',
        'lost_area' : lost_area,
        "type" : 'lavrador',
        'owner_phone': owner_phone,
        'avatar': "",
        'dog_name':dog_name,
    }

    try:
        lost_dogs_db.insert_one(new_report)
        return {'success': True, 'message': 'Lost dog reported successfully'}, 200
    except Exception as e:
        print(f"Error saving lost dog report: {e}")
        return {'success': False, 'error': 'Failed to report lost dog'}, 500

    