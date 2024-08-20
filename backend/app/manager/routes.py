from flask import jsonify, request ,render_template
from app.manager import bp 
from app.extensions import mongo
from bson import json_util
from bson.objectid import ObjectId
import json
from bson import json_util
import random


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
    
@bp.route('/update-status/<reportId>/<userId>', methods=['POST'])
def update_status(reportId, userId):
    db = mongo.client.get_database("Reports")
    reports = db.get_collection("app_bugs_reports")

    users = mongo.client.get_database("Users")
    notify_db = users.get_collection("notifications")
    notify_db.insert_one({
        "user_id": userId,
        "report_id": reportId, 
        "status": "in progress",
    })

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
    

    #-----------------TemperatureReport--------------


    
@bp.route('/Temperature', methods=['GET'])
def TemperatureReport(): 
    return render_template('TemperatureReport.html')
    
@bp.route('/TemperatureReport', methods=['GET'])
def TemperatureData():
    with open('token.json', 'r') as f:
        data = json.load(f)
    readings_data = data.get('data', {}).get('readings_data', [])
    readings_data = readings_data[:27]
    db = mongo.client.get_database("Map")
    parks = db.get_collection("parks")
    projection = {"latitude": 1, "longitude": 1, "_id": 0}

    park_locations = list(parks.find({}, projection))
    i = 0
    extracted_data = []
    for reading in readings_data:
        if(i == 27):
            i = 0
        temp_data = {
            'Temperature': reading.get('Temperature'),
            'sample_time_utc': reading.get('sample_time_utc'),
            'Location': {
                    'lat': park_locations[i].get('latitude'),
                    'lng': park_locations[i].get('longitude')
                }
        }
        i += 1
        extracted_data.append(temp_data)
    return json_util.dumps({'readings_data': extracted_data}) , 200

@bp.route('/overcrowdingReport', methods=['GET'])
def OvercrowdingDogParks():
    db = mongo.client.get_database("Map")
    parks = db.get_collection("parks")
    projection = {"latitude": 1, "longitude": 1, "_id": 0}

    park_locations = list(parks.find({}, projection))
    Overcrowding = ["high", "medium", "low"]
    extracted_data = []
    for park in park_locations:
        temp_data = {
            'Location': {
                    'lat': park.get('latitude'),
                    'lng': park.get('longitude')
                },
            'Overcrowding': random.choice(Overcrowding) 
            
        }
        extracted_data.append(temp_data)
    return json_util.dumps({'readings_data': extracted_data}) , 200
  


