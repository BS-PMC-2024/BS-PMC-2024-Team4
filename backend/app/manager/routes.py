from flask import jsonify, request ,render_template
from app.manager import bp 
from app.extensions import mongo
from bson import json_util , ObjectId

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

@bp.route('/deleteUser/<string:user_id>', methods=['DELETE'])
def deleteUser(user_id):
    db = mongo.client.get_database("Users")
    users = db.get_collection("user-details")
    
    result = users.delete_one({'user_id': user_id})
    if result.deleted_count > 0:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

#for updating lost dog page

@bp.route('/manageLostDogsPage', methods=['GET', 'POST'])
def manage_lost_dogs_page():
    return render_template('updateLostDogsPage.html')


@bp.route('/getLostDogReports', methods=['GET'])
def get_lost_dog_reports():
    db = mongo.client.get_database("lostDogs")
    report_lost_collection = db.get_collection("reportLost")
    reports = list(report_lost_collection.find())
    for report in reports:
        report['_id'] = str(report['_id'])  # Convert ObjectId to string
    return json_util.dumps({'reports': reports}), 200


@bp.route('/moveReport/<string:report_id>', methods=['POST'])
def move_report(report_id):
    db = mongo.client.get_database("lostDogs")
    report_lost_collection = db.get_collection("reportLost")
    lost_dogs_collection = db.get_collection("lostdog")
    report = report_lost_collection.find_one({'_id': ObjectId(report_id)})
    if not report:
        return jsonify({'message': 'Report not found', 'success': False}), 404

    try:
        lost_dogs_collection.insert_one(report)
        report_lost_collection.delete_one({'_id': ObjectId(report_id)})
        return jsonify({'message': 'Report moved to Lost Dogs', 'success': True}), 200
    except Exception as e:
        print(f"Error moving report: {e}")
        return jsonify({'message': 'Failed to move report', 'success': False}), 500

@bp.route('/deleteReport/<string:report_id>', methods=['DELETE'])
def delete_report(report_id):
    db = mongo.client.get_database("lostDogs")
    report_lost_collection = db.get_collection("reportLost")
    result = report_lost_collection.delete_one({'_id': ObjectId(report_id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'Report deleted successfully', 'success': True}), 200
    else:
        return jsonify({'message': 'Report not found', 'success': False}), 404