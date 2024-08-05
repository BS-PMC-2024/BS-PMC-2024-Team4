from flask import jsonify, logging, request
from app.info import bp
from app.extensions import mongo
from bson import json_util
import base64

@bp.route('getFood/', methods=['GET', 'POST'])
def getFood():

    food_collection = mongo.client.get_database("Info").get_collection("Food")
    data = list(food_collection.find())
    
    for item in data:
        item['_id'] = str(item['_id'])
    
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Unable to load data"}), 404


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
