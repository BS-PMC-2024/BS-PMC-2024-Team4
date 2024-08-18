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

def test_submit_bugs_report(client, mock_mongo):
    bug_data = {
        "user_id": "123",
        "screen": "info",
        "description": "App crashes when clicking on the info screen."
    }
    
    response = client.post('user/submitBugsReport', data=json.dumps(bug_data), content_type='application/json')
    
    assert response.status_code == 200
    data = response.json
    assert data['message'] == "Bug report submitted successfully"
    
    bugs_collection = mock_mongo['app_bugs_reports']
    saved_bug = bugs_collection.find_one({"user_id": "123"})
    assert saved_bug is not None
    assert saved_bug['screen'] == "info"
    assert saved_bug['description'] == "App crashes when clicking on the info screen."
    assert saved_bug['status'] == "waiting"

def test_submit_bugs_report_empty_description(client, mock_mongo):
    bug_data = {
        "user_id": "123",
        "screen": "info",
        "description": ""
    }
    
    response = client.post('user/submitBugsReport', data=json.dumps(bug_data), content_type='application/json')
    
    assert response.status_code == 200
    data = response.json
    assert data['message'] == "Bug report submitted successfully"
    
    bugs_collection = mock_mongo['app_bugs_reports']
    saved_bug = bugs_collection.find_one({"user_id": "123"})
    assert saved_bug is not None
    assert saved_bug['screen'] == "info"
    assert saved_bug['description'] == ""
    assert saved_bug['status'] == "waiting"

def test_submit_bugs_report_missing_user_id(client, mock_mongo):
    bug_data = {
        "screen": "info",
        "description": "App crashes when clicking on the info screen."
    }
    
    response = client.post('user/submitBugsReport', data=json.dumps(bug_data), content_type='application/json')
    
    assert response.status_code == 400
    data = response.json
    assert data['error'] == "user_id is required"