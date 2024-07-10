from flask import jsonify
from app.user import bp
from app.extensions import mongo
from bson import json_util

@bp.route('/', methods=['GET', 'POST'])
def index():
    user_db = mongo.client.get_database("Users").get_collection("user-details")
    query = {'first_name': 'Yovel'}
    user = user_db.find_one(query)
    return json_util.dumps(user)

@bp.route('/add')
def add():
    user_db = mongo.client.get_database("Users").get_collection("user-details")
    user_db.insert_one({'first_name': 'Yovel', 'last_name': 'Nir'})