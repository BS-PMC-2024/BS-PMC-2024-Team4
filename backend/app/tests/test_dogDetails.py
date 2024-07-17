# import pytest
# import base64
# import json
# from flask import Flask
# from bson import json_util
# from app import create_app, mongo
# from mongomock import MongoClient as MockMongoClient

# @pytest.fixture
# def app():
#     app = create_app(config_class='TestingConfig')  # Ensure 'TestingConfig' is passed as a string
#     mongo.set_client(MockMongoClient())
    
#     with app.app_context():
#         yield app

# @pytest.fixture
# def client(app):
#     return app.test_client()

# def test_getAllDogs(client):
#     with app.app_context():
#         test_data = {
#             "friendly": True,
#             "identifier": "good dog",
#             "lost_area": "BS",
#             "type": "labrador",
#             "owner_phone": "0525555555",
#             "avatar": base64.b64encode(b'Binary data').decode('utf-8'),
#             "dog_name": "BRUNO"
#         }
#         mongo.db.lostdog.insert_one(test_data)

#     # Make a GET request to the endpoint
#     response = client.get('/lostDog/getAllDogs/')
    
#     # Assert the response status code
#     assert response.status_code == 200
    
#     # Deserialize the JSON response
#     data = json.loads(response.data.decode('utf-8'))
    
#     # Assert the returned data matches the inserted test data
#     assert len(data) == 1
#     dog = data[0]
#     assert dog["friendly"] is True
#     assert dog["identifier"] == "good dog"
#     assert dog["lost_area"] == "BS"
#     assert dog["type"] == "labrador"
#     assert dog["owner_phone"] == "0525555555"
#     assert dog["avatar"] == base64.b64encode(b'Binary data').decode('utf-8')
#     assert dog["dog_name"] == "BRUNO"
