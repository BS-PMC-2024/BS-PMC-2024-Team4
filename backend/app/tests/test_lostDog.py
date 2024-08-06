
import pytest
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
import base64
import json

import pytest
from flask import json
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
import base64

# Data to be used in tests
user_data = {
    'friendly': 'true',
    'identifier': 'a good one',
    'lost_area': 'BS',
    'type': 'lavrador',
    'owner_phone': '1234567890',
    'avatar': b'avatar_data',
    'dog_name': 'BRUNO'
}

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
    ld = mock_client['lostDogs']
    mongo.set_client(mock_client)  # Ensure the mock client is set globally for use in the app
    return ld

def test_get_all_dogs(client, mock_mongo):
    # Insert mock data
    mock_db = mock_mongo['lostdog']
    mock_db.insert_one(user_data)
    
    # Send request to the endpoint
    response = client.get('/lostDog/getAllDogs/')
    
    # Check the response
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    # Check that the data matches
    assert len(response_data) == 1
    assert response_data[0]['friendly'] == 'true'
    assert response_data[0]['identifier'] == 'a good one'
    assert response_data[0]['lost_area'] == 'BS'
    assert response_data[0]['type'] == 'lavrador'
    assert response_data[0]['owner_phone'] == '1234567890'
    assert response_data[0]['dog_name'] == 'BRUNO'
    assert response_data[0]['avatar'] == base64.b64encode(user_data['avatar']).decode('utf-8')
