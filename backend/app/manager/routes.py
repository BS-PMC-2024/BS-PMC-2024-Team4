from flask import jsonify, request ,render_template
from app.manager import bp 
from app.extensions import mongo
from bson import json_util

##for deleteUser
#import firebase_admin
#from firebase_admin import auth


@bp.route('/manageUsersPage', methods=['GET', 'POST'])
def manageUsersPage():
    return render_template('manageUsers.html')

@bp.route('/getUsers', methods=['GET'])
def getUsers():
    db = mongo.client.get_database("Users")
    users = db.get_collection("user-details")
    Allusers = list(users.find({}))
    for user in Allusers:
        user['_id'] = str(user['user_id'])  # Convert ObjectId to string
    return json_util.dumps(Allusers) , 200
    #return jsonify(Allusers), 200

@bp.route('/deleteUser/<string:user_id>', methods=['DELETE'])
def deleteUser(user_id):
    db = mongo.client.get_database("Users")
    users = db.get_collection("user-details")
    result = users.delete_one({'user_id': user_id})
    if result.deleted_count > 0:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404
