from flask import jsonify
from app.user import bp
from app.extensions import mongo
from bson import json_util

@bp.route('/', methods=['GET', 'POST'])
def index():
    healthcare_db = mongo.client.get_database("Info").get_collection("Healthcare")
    query = {'case': 'Burn on the paws'}
    user = healthcare_db.find_one(query)
    return json_util.dumps(healthcare_db)
