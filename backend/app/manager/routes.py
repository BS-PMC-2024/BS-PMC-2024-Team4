from flask import jsonify, request ,render_template
from app.manager import bp 
from app.extensions import mongo
from bson import json_util
from bson.objectid import ObjectId, InvalidId


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

@bp.route('/getApprovedReports', methods=['GET'])
def getApprovedReports():
    db = mongo.client.get_database("Reports")
    reports = db.get_collection("roads_reports")

    query = {'status': 'In Progress'}
    approved_reports = list(reports.find(query))
    for report in approved_reports:
        report['_id'] = str(report['_id'])
    return json_util.dumps(approved_reports) , 200
 

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
    

@bp.route('/SendNotification', methods=['POST'])
def SendNotification():
    data = request.json
    reportAddress = data.get('address')
    notificationTitle = data.get('title')
    notificationMessage = data.get('message')

    if not reportAddress or not notificationTitle or not notificationMessage:
        return jsonify({'error': 'Missing required data'}), 400

    notify_db = mongo.client.get_database("Users").get_collection("notifications")
    notify_db.insert_one({
        "user_id": 0,
        "address": reportAddress,
        "notificationTitle": notificationTitle,
        "notificationMessage": notificationMessage
    })  
    return jsonify({'message': 'Notification sent successfully'}), 200



# ------------ Point of Interest ---------------

@bp.route('/listPointsOfInterest', methods=['GET'])
def list_points_of_interest():
    db = mongo.client.get_database("Map")
    parks = db.get_collection("parks").find()  # Retrieve all documents from 'parks' collection
    water_spots = db.get_collection("Water").find()  # Retrieve all documents from 'Water' collection
    
    points_of_interest = []

    # Process parks
    for park in parks:
        point = {
            "point_id": str(park['_id']),
            "point_name": park.get("name", "Unnamed Park"),
            "location": {
                "lat": park['latitude'],
                "lng": park['longitude']
            },
            "type": "park",
            "park_address": park.get("address")
        }
        points_of_interest.append(point)

    # Process water spots
    for water in water_spots:
        point = {
            "point_id": str(water['_id']),
            "point_name": water.get("name", "Unnamed Water Spot"),
            "location": {
                "lat": water['latitude'],
                "lng": water['longitude']
            },
            "type": "water"
        }
        points_of_interest.append(point)

    return jsonify({"points_of_interest": points_of_interest}), 200

@bp.route('/addPointOfInterest', methods=['POST'])
def add_point_of_interest():
    db = mongo.client.get_database("Map")
    data = request.json
    
    collection_name = "parks" if data['type'] == "park" else "Water"
    collection = db.get_collection(collection_name)

    new_point = {
        "name": data.get("point_name", "Unnamed Point"),
        "latitude": float(data['location']['lat']),
        "longitude": float(data['location']['lng']), 
    }

    if(collection_name == "parks"):
        new_point['address'] = data.get("park_address", "Unknown Address")

    result = collection.insert_one(new_point)

    if result.inserted_id:
        return jsonify({"success": True, "point_id": str(result.inserted_id)}), 201
    else:
        return jsonify({"success": False, "error": "Failed to add point"}), 500

@bp.route('/updatePointOfInterest/<point_id>', methods=['PUT'])
def update_point_of_interest(point_id):
    db = mongo.client.get_database("Map")
    data = request.json
    
    collection_name = "parks" if data['type'] == "park" else "Water"
    collection = db.get_collection(collection_name)

    update_data = {
        "name": data.get("point_name", "Unnamed Point"),
        "latitude": float(data['location']['lat']),
        "longitude": float(data['location']['lng'])
    }

    if(collection_name == "parks"):
        update_data['address'] = data.get("park_address", "Unknown Address")

    result = collection.update_one({"_id": ObjectId(point_id)}, {"$set": update_data})

    if result.matched_count > 0:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Failed to update point"}), 404

@bp.route('/deletePointOfInterest/<point_id>', methods=['DELETE'])
def delete_point_of_interest(point_id):
    db = mongo.client.get_database("Map")
    point_type = request.args.get('type')
    
    # Determine the collection based on the point type
    collection_name = "parks" if point_type == "park" else "Water"
    collection = db.get_collection(collection_name)

    result = collection.delete_one({"_id": ObjectId(point_id)})

    if result.deleted_count > 0:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Failed to delete point"}), 404
