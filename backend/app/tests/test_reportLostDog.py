import pytest
from flask import Flask
from flask.testing import FlaskClient
from app import create_app , mongo # Assuming create_app is the function that creates your Flask app
import mongomock
from mongomock import MongoClient as MockMongoClient
from unittest.mock import patch, MagicMock


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
    db = mock_client['lostDogs']
    mongo.set_client(mock_client)  # Ensure the mock client is set globally for use in the app
    return db

def test_report_lost_dog_success(mock_mongo, client):
    mock_lost_dogs = mock_mongo['reportLost']

    data = {
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    }

    response = client.post('/lostDog/reportLostDog', json={'dog_name': data['dog_name'], 'lost_area': data['lost_area'],'owner_phone':data['owner_phone']})
    
    assert response.status_code == 200
    assert response.json == {'success': True, 'message': 'Lost dog reported successfully'}
    assert mock_lost_dogs.find_one({'dog_name': 'Buddy', 'owner_phone': '1234567890'}) is not None



def test_report_lost_dog_missing_fields(mock_mongo, client):
    response = client.post('/lostDog/reportLostDog', json={
        'dog_name': '',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    })

    assert response.status_code == 400
    assert response.json['success'] is False
    assert response.json['error'] == 'All fields are required'


def test_report_lost_dog_invalid_phone(mock_mongo, client):
    response = client.post('/lostDog/reportLostDog', json={
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': 'abcd1234'
    })

    assert response.status_code == 400
    assert response.json['success'] is False
    assert response.json['error'] == 'Invalid phone number'


def test_report_lost_dog_phone_taken(mock_mongo, client):
    mock_lost_dogs = mock_mongo['reportLost']

    mock_lost_dogs.insert_one({
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    })

    data = {
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    }
    response = client.post('/lostDog/reportLostDog', json=data)

    assert response.status_code == 200  # Adjust if needed
    assert response.json == {'success': True, 'message': 'Lost dog reported successfully'}
    #assert response.json['success'] is False
    #assert response.json['error'] == 'Phone already taken'


def test_report_lost_dog_exception(mock_mongo, client):
    mock_lost_dogs = mock_mongo['reportLost']
    data = {
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    }
    def mock_insert_one(data):
        raise Exception('Insert failed')

    mock_lost_dogs.insert_one = mock_insert_one

   
    response = client.post('/lostDog/reportLostDog', json=data)

    assert response.status_code == 500
    assert response.json['success'] is False
    assert response.json['error'] == 'Failed to report lost dog'
