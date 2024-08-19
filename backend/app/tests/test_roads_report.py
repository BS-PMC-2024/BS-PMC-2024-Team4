import pytest
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
import json

@pytest.fixture
def app():
    app = create_app()
    app.config.from_object('config.TestingConfig')
    mongo.set_client(MockMongoClient())
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_mongo():
    mock_client = MockMongoClient()
    db = mock_client['Reports']
    mongo.set_client(mock_client) 
    return db


def test_submit_roads_report(client, mock_mongo):
    report_data = {
        "user_id": "123",
        "type": "pest_control",
        "description": "Saw municipal workers spraying the grass.",
        "address": "123 Main St"
    }
    
    response = client.post('user/submitRoadsReport', data=json.dumps(report_data), content_type='application/json')
    
    assert response.status_code == 200
    data = response.json
    assert data['message'] == "Bug report submitted successfully"
    
    roads_collection = mock_mongo['roads_reports']
    saved_report = roads_collection.find_one({"user_id": "123"})
    assert saved_report is not None
    assert saved_report['type'] == "pest_control"
    assert saved_report['description'] == "Saw municipal workers spraying the grass."
    assert saved_report['address'] == "123 Main St"
    assert saved_report['status'] == "waiting"

def test_submit_roads_report_empty_description(client, mock_mongo):
    report_data = {
        "user_id": "123",
        "type": "pest_control",
        "description": "",
        "address": "123 Main St"
    }
    
    response = client.post('user/submitRoadsReport', data=json.dumps(report_data), content_type='application/json')
    
    assert response.status_code == 200
    data = response.json
    assert data['message'] == "Bug report submitted successfully"
    
    roads_collection = mock_mongo['roads_reports']
    saved_report = roads_collection.find_one({"user_id": "123"})
    assert saved_report is not None
    assert saved_report['type'] == "pest_control"
    assert saved_report['description'] == ""
    assert saved_report['address'] == "123 Main St"
    assert saved_report['status'] == "waiting"

def test_submit_roads_report_missing_user_id(client, mock_mongo):
    report_data = {
        "type": "pest_control",
        "description": "Saw municipal workers spraying the grass.",
        "address": "123 Main St"
    }
    
    response = client.post('user/submitRoadsReport', data=json.dumps(report_data), content_type='application/json')
    
    assert response.status_code == 400
    data = response.json
    assert data['error'] == "user_id is required"