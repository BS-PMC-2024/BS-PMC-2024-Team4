from flask import jsonify, logging, request
from app.info import bp
from app.extensions import mongo
from bson import json_util
import base64
import json
from pymongo import MongoClient


@bp.route('getFood/', methods=['GET', 'POST'])
def getFood():
    try:
        food_collection = mongo.client.get_database("Info").get_collection("Food")
        data = list(food_collection.find())
    
        for item in data:
            item['_id'] = str(item['_id'])
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Unable to load data"}), 500


@bp.route('getHealthCases/', methods=['GET'])
def getCases():
    healthcare_collection = mongo.client.get_database("Info").get_collection("Healthcare")   
    documents = healthcare_collection.find({'guidelines': {'$regex': '\\\\n'}})

    for doc in documents:
        # Replace literal '\n' with actual newline character
        corrected_guidelines = doc['guidelines'].replace('\\n', '\n')
        # Update the document in the collection
        healthcare_collection.update_one(
            {'_id': doc['_id']},
            {'$set': {'guidelines': corrected_guidelines}}
        )

    data = list(healthcare_collection.find())
    
    for item in data:
        item['_id'] = str(item['_id'])
    
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Unable to load data"}), 404

@bp.route('getParks/', methods=['GET'])
def getParks():
    parks = mongo.client.get_database("Map").get_collection("parks")   
    data = list(parks.find())
    for item in data:
        item['_id'] = str(item['_id'])

    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Unable to load data"}), 404

@bp.route('getVets/', methods=['GET'])
def getVets():
    try:
        vets = mongo.client.get_database("Map").get_collection("vets")   
        data = list(vets.find())
        for item in data:
            item['_id'] = str(item['_id'])
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error fetching vets: {e}")
        return jsonify({"error": str(e)}), 500
        
@bp.route('getWaterSpots/', methods=['GET'])
def getWaterSpots():
    items = mongo.client.get_database("Map").get_collection("Water")   
    data = list(items.find())
    for item in data:
        item['_id'] = str(item['_id'])

    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Unable to load data"}), 404

@bp.route('getBlockedAreas/', methods=['GET'])
def getBlockedAreas():
    items = mongo.client.get_database("Map").get_collection("road_blockings") 
    data = list(items.find())
    for item in data:
        item['_id'] = str(item['_id'])
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Unable to load data"}), 404
    
@bp.route('/sendMessageToVet', methods=['POST'])
def sendMessageToVet():
    print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    data = request.get_json()
    if 'user_id' not in data: 
         return jsonify({"error": "user_id is required"}), 400
    
    print("ssssssssssssssssssss")
    user_id = data['user_id']
    subject = data.get('subject')
    message = data.get('message')

    bugs_db = mongo.client.get_database("Reports").get_collection("ask_vet")
    bugs_db.insert_one({"user_id": user_id, "subject": subject, "message": message })
    
    return jsonify({"message": "Bug report submitted successfully"}), 200