from flask import jsonify, request
from app.user import bp
from app.extensions import mongo
from bson import json_util
import re
import base64

email_regex = re.compile("[\\w\\-\\.]+@([\\w\\-]+\\.)[\\w]+")
phone_regex = re.compile("^[0-9]+$")

@bp.route('getUserDetails/', methods=['POST', 'GET'])
def getDetails():
    user_id = request.get_json()['uid']
    user_db = mongo.client.get_database("Users").get_collection("user-details")
    query = {'user_id': user_id}
    user = user_db.find_one(query)
    
    if user:
        del user['_id']
        if 'avatar' in user:
            user['avatar'] = base64.b64encode(user['avatar']).decode('utf-8')
        return json_util.dumps(user)
    else:
        return jsonify({"error": "User not found"}), 404

@bp.route('/saveUserDetails', methods=['POST'])
def saveDetails():
    data = request.get_json()
    user_id = data['user_id']

    user_db = mongo.client.get_database("Users").get_collection("user-details")

    if 'avatar' in data:
        avatar_data = data.pop('avatar')
        data['avatar'] = base64.b64decode(avatar_data)

    if 'email' in data:
        exist = user_db.find_one({'email': data['email']})
        user = user_db.find_one({'email': data['email'], 'user_id': user_id})

        if exist != user or not email_regex.match(data['email']):
            return {'success': False, 'error': 'Email already taken, please choose a different email'}
    
    exist = user_db.find_one(data)

    if exist:
        return {'success': True}
    
    query = {'user_id': user_id}

    exist = user_db.find_one(query)

    if exist:
        values = {'$set': data}
        
        result = user_db.update_one(query, values)

        return {'success': True} if result.matched_count > 0 else {'success': False, 'error': 'There was a problem saving your details'}    
    else:
        result = user_db.insert_one(data)

        return {'success': True} if result.acknowledged else {'success': False, 'error': 'There was a problem saving your details'}