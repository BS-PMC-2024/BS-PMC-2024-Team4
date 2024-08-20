import pytest
from flask import Flask
from app import create_app, mongo
from unittest.mock import patch
from mongomock import MongoClient as MockMongoClient
import json
from bson import ObjectId


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
def mock_reports():
    mock_client = MockMongoClient()
    db = mock_client['Reports']
    mongo.set_client(mock_client)  
    return db
    

def test_table_is_ok(mock_reports, client):
    response = client.get('/manager/getReports')
    assert response.status_code == 200
    try:
        data = json.loads(response.data.decode('utf-8'))
    except json.JSONDecodeError:
        pytest.fail("Response data is not in valid JSON format.")
    
    assert data is not None, "Data should not be None"
    
    

def test_backend_frontend_buttons(mock_reports, client):
    mock_reports_collection = mock_reports['app_bugs_reports']
    report_id = ObjectId('66c05a1a067c3f13a3617e75')
    user_id = ObjectId('66c05a1a067c3f13a3617e99')
    
    mock_reports_collection.insert_one({'_id': report_id, 'description': 'Issue 1', 'status': 'waiting'})

    # Test backend button
    response_backend = client.post(f'manager/update-status/{report_id}/{user_id}', json={'status': 'In Progress'})
    print("Response Backend Data:", response_backend.get_json())
    
    assert response_backend.status_code == 200

    # Verify that the status was updated
    updated_report = mock_reports_collection.find_one({'_id': report_id})
    assert updated_report['status'] == 'In Progress'
