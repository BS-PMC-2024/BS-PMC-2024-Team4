from flask import jsonify, request ,render_template
from app.manager import bp 
from app.extensions import mongo
from bson import json_util
from bson.objectid import ObjectId


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

# -----------user reports-------------------

@bp.route('/UserReports', methods=['GET', 'POST'])
def UserReports():
    return render_template('UserReports.html')

@bp.route('/getReports', methods=['GET'])
def getReports():
    db = mongo.client.get_database("Reports")
    reports = db.get_collection("app_bugs_reports")
    Allreports = list(reports.find({}))
    for report in Allreports:
        report['_id'] = str(report['_id'])
    return json_util.dumps(Allreports) , 200
    
@bp.route('/update-status/<reportId>', methods=['POST'])
def update_status(reportId):
    db = mongo.client.get_database("Reports")
    reports = db.get_collection("app_bugs_reports")
    print(f"Updating status for report ID: {reportId}")  
    new_status = request.json['status']
    print(f"New status to set: {new_status}") 
    # Convert reportId to ObjectId
    result = reports.update_one(
        {'_id': ObjectId(reportId)},
        {'$set': {'status': new_status}}
    )
    if result.modified_count:
         return jsonify({'message': 'Status updated successfully'}), 200
        
    else:
        return jsonify({'error': 'Update failed'}), 400
    
    